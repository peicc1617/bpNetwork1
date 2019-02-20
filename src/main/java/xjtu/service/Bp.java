package xjtu.service;

import java.util.Random;

public class Bp {
	private double [][] layer; //神经网络各层节点
	private double [][] layerErr;  //节点误差
	private double [][][] weight; //节点权重
	private double [][][] weight_delta; //节点权重变化量
	private double rate; //学习率
	private double mobp; //动量系数

	public Bp(int[] layerNum,double rate,double mobp) {
		this.rate = rate;
		this.mobp = mobp;
		this.layer = new double[layerNum.length][];
		this.layerErr = new double[layerNum.length][];
		this.weight = new double[layerNum.length][][];
		this.weight_delta = new double[layerNum.length][][];
		Random random = new Random();
		for (int i=0;i<layerNum.length;i++) {
			this.layer[i] = new double[layerNum[i]];
			this.layerErr[i] = new double[layerNum[i]];
			if (i<layerNum.length-1) {
				this.weight[i] = new double[layerNum[i]+1][layerNum[i+1]];
				this.weight_delta[i] = new double[layerNum[i]+1][layerNum[i+1]];
				for (int j=0;j<layerNum[i]+1;j++) {
					for (int k=0;k<layerNum[i+1];k++) {
						this.weight[i][j][k] = random.nextDouble();
					}
				}
			}
				
		}
	}
	public double[] computeOut(double[] dataIn) {
		for (int i=1;i<layer.length;i++) {
			for (int j=0;j<layer[i].length;j++) {
				double z = weight[i-1][layer[i-1].length][j];
				for (int k=0;k<layer[i-1].length;k++) {
					layer[i-1][k]=i==1?dataIn[k]:layer[i-1][k];
					z+=weight[i-1][k][j]*layer[i-1][k];
				} 
				layer[i][j] = 1/(1+Math.exp(-z+3));
			}
		}
		return layer[layer.length-1];
		
		
	}
	public void updateWeight(double[] tar) {
		int i = layer.length-1; 
		for (int j=0;j<layerErr[i].length;j++) {
			layerErr[i][j] = layer[i][j]*(1-layer[i][j])*(tar[j]-layer[i][j]);
		}
		while (i-->0) {
			for (int j=0;j<layerErr[i].length;j++) {
				double z =0.0;
				for(int k=0;k<layerErr[i+1].length;k++){
                    z=z+i>0?layerErr[i+1][k]*weight[i][j][k]:0;
                    weight_delta[i][j][k]= mobp*weight_delta[i][j][k]+rate*layerErr[i+1][k]*layer[i][j];//隐含层动量调整
                    weight[i][j][k]+=weight_delta[i][j][k];//隐含层  权重调整  
                    if(j==layerErr[i].length-1){
                        weight_delta[i][j+1][k]= mobp*weight_delta[i][j+1][k]+rate*layerErr[i+1][k];//截距动量调整
                        weight[i][j+1][k]+=weight_delta[i][j+1][k];//截距权重调整
                    }
                }
                layerErr[i][j]=z*layer[i][j]*(1-layer[i][j]);//记录误差
			}
		}
	}
	
	public void train(double[] in, double[] tar){
        double[] out = computeOut(in);
        updateWeight(tar);
    }
	
}