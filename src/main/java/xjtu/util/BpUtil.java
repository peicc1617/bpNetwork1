package xjtu.util;

public class BpUtil {
	
	
	
	
	public double[][] generateTrainData(String traindata,String attrOfData) {
		
		int dataDegree = attrOfData.split(",").length;
		String[] datastr = traindata.split(",");
		int datanum = datastr.length/dataDegree;
		 
		double res[][] = new double[datanum][dataDegree];
		
		for (int i=0;i<datastr.length;i++) {
			
			res[i/dataDegree][i%dataDegree] = Double.parseDouble(datastr[i]);
		}
		
		return res;
		
	}

	public void normalize(double[][] data) {
		
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
