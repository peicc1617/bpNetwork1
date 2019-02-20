package xjtu.controller;



import java.util.Arrays;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import xjtu.service.Bp;


@Controller
public class Bpnet {
	
	private double data[][];
	private int[] layer;
	
	private double learnRate = 0.8; 
	private double mobp = 0.15;
	private int iterations = 1000;
	private double err = 0.001;
	
	private double[] iterationsErr;
	
	
	private Bp bpnet;
	
	
	@RequestMapping("/bp.train")
	@ResponseBody
//	通过处理方法的形参接收参数：形参名称与请求参数的名称完全相同，适用于post和get提交方式
	public String getTrainData(String traindata,String attrOfData,String netparameter) {
		
		generateTrainData(traindata, attrOfData);
		//归一化数据
		normalize();
		generateBpNet(netparameter);
		
		//80%的作为训练，20%作为测试
		int trainOffSet = (int) (data.length*0.8);
		double[][] trainData = Arrays.copyOfRange(data, 0, trainOffSet);
		double[][] testData = Arrays.copyOfRange(data, trainOffSet, data.length);;
		double[][] comput_out = new double[testData.length][];
		//配置参数
		
		//设置训练次数，开始训练
		for (int tim=0;tim<iterations;tim++) {
			for (int index=0;index<trainData.length;index++) {
				double[] input = Arrays.copyOfRange(trainData[index], 0, trainData[index].length-1);
				double[] output = Arrays.copyOfRange(trainData[index], trainData[index].length-1, trainData[index].length);
				bpnet.train(input,output);
			}
			
			for (int index=0;index<testData.length;index++) {
				double[] input = Arrays.copyOfRange(testData[index], 0, testData[index].length-1);
				comput_out[index] = bpnet.computeOut(input);
			}
			iterationsErr[tim] = getIterationsErr(comput_out,testData);
		}
		
		//System.out.println(Arrays.toString(iterationsErr));
		return Arrays.toString(iterationsErr);
	}
	
	
	@RequestMapping("/bp.predict")
	//返回结果直接写入到HTTP response body中
	@ResponseBody
	public String predictData(String predictdata) {
		String[] predata = predictdata.split(",");
		double[] input = new double[predata.length];
		for (int i=0;i<input.length;i++) {
			input[i] = Double.parseDouble(predata[i]);
		}
		System.out.println(Arrays.toString(input));
		System.out.println(Arrays.toString(bpnet.computeOut(input)));
		double ans = 3-Math.log(1/bpnet.computeOut(input)[0] -1);
		return String.valueOf(ans);
	}
	
	
	private void generateBpNet(String netparameter) {
		
		String[] param = netparameter.split(";");
		String[] layerstr = param[0].split(",");
		this.iterations = Integer.parseInt(param[1]);
		this.err = Double.parseDouble(param[2]);
		this.learnRate = Double.parseDouble(param[3]);
		this.mobp = Double.parseDouble(param[4]);
		
		this.iterationsErr = new double[iterations];
		//用户只设定隐含层，输入层自动匹配，输出层为1
		this.layer = new int[layerstr.length+2];
		this.layer[0] = data[0].length-1;
		for (int i=0;i<layerstr.length;i++) {
			this.layer[i+1] = Integer.parseInt(layerstr[i]);
		}
		this.layer[layerstr.length+1]  = 1; 
		//设置神经网络的层数，各层神经元数，学习率，动量系数
		this.bpnet = new  Bp(layer,learnRate,mobp);
		//System.out.println(Arrays.toString(layer));
		
	}

	private  double getIterationsErr(double[][] comput_out, double[][] testData) {
		
		double sum = 0;
		int index = testData[0].length;
		for (int i=0;i<testData.length;i++) {
			
			sum += Math.abs(Math.log(1/testData[i][index-1] -1) - Math.log(1/comput_out[i][0] -1));
		}
		return sum/testData.length;
		
	}
	
	public void generateTrainData(String traindata,String attrOfData) {
	
		int dataDegree = attrOfData.split(",").length;
		String[] datastr = traindata.split(",");
		int datanum = datastr.length/dataDegree;
		 
		double res[][] = new double[datanum][dataDegree];
		
		for (int i=0;i<datastr.length;i++) {
			
			res[i/dataDegree][i%dataDegree] = Double.parseDouble(datastr[i]);
		}
		this.data =  res;
	}
	
	public void normalize() {
		
		double max = Double.MIN_VALUE;
		for (int i=0;i<data.length;i++) {
			for (int j=0;j<data[0].length;j++) {
				if (j==data[0].length-1) {
					data[i][j] = 1/(1+Math.exp(-data[i][j]+3));
				} else {
					max = Math.max(max, data[i][j]);
				}
			}
		}
		for (int i=0;i<data.length;i++) {
			for (int j=0;j<data[0].length;j++) {
				if (j==data[0].length-1) {
					continue;
				} else {
					data[i][j] = data[i][j]/max;
				}
			}
		}
	}

}
