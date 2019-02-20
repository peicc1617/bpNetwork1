

//////////////////网络训练
function netTrain() {
	
	$("#waitForTrain").modal('show');
	$('#waiting').css("display","inline");
	$('#completed').css("display","none");
	
	var dataset = $('#myBootstrapTtable').bootstrapTable('getData');
	var traindata = "";
	var attrOfData = "";
	var netparameter = "";
	
	
	for(var i=0;i<dataset.length;i++) {
		for (var attr in dataset[i]) {
			if (attr.startsWith("input") || attr.startsWith("output")) {
				
				if (i==0) {
					attrOfData += attr;
					attrOfData += ",";
				}
				
				traindata += dataset[i][attr];
				traindata += ",";
			}
		}
	}
	traindata = traindata.substring(0,traindata.length-1);
	attrOfData = attrOfData.substring(0,attrOfData.length-1);
	
	netparameter = netparameter + $("#nodes").val() + ";";
	netparameter = netparameter + $("#iterator").val() +";";
	netparameter = netparameter + $("#error").val() + ";";
	netparameter = netparameter + $("#learnRate").val() +";";
	netparameter = netparameter + $("#mobp").val();
	
	$.ajax({
		type: 'post',
		url:  'bp.train',
		data: {traindata: traindata,attrOfData:attrOfData,netparameter:netparameter}, 
		success: function(data){
			  $('#waiting').css("display","none");
              $('#completed').css("display","inline");
              checkProgress(data);
		},
		error: function(data){
			
		}
		
	})
	
}

function checkProgress(processData){
	processData = eval(processData);
	var divid = "progressGraph";
	var myChart = echarts.init(document.getElementById(divid));
    // 使用刚指定的配置项和数据显示图表。
	var xdata = [];
	var ydata = [];
	
	for (var i=0;i<processData.length;i++) {
		xdata.push(i+1);
		ydata.push(processData[i]);
	}
	
	
	var option = {  
            title: {  
            	show : true,
                text : '网络收敛过程',
                textAlign : 'left',
		    	padding : [5,0,0,180]
            },  
            tooltip : {  
                trigger : 'axis',
                axisPointer : {
                	type : 'cross'
                }
            },  
            toolbox: {  
            	show : true,
		        itemSize: 18,
		        left: '81%',
		        top: '5%',
                feature: {  
                    saveAsImage : {show: true}, 
                }  
            },  
            xAxis : [  
                {  
                    type : 'category',  
                    boundaryGap : false,  
                    data : xdata  
                }  
            ],  
            yAxis : [  
                {  
                    type : 'value',
                }
            ],  
            series : [  
                {  
                    name:'误差',  
                    type:'line',  
                    data: ydata,
                }
            ]  
        };  
	
		myChart.setOption(option);
		
	}


function showPredictInfo() {
	$("#waitForTrain").modal("hide");
	var inputs = $("#inputs").find("span.editable");
	var outputs = $("#outputs").find("span.editable");
	
	$("#predictdiv").empty();
	$("#predictdiv").append("<br><br>");
	$("#predictdiv").append("<h4 style=\"padding-left:10px\">输出预测</h4>");
	
	for (var i=0;i<inputs.length;i++) {
		
		var titleName = inputs[i].innerHTML;
		var html = "<div class=\"col-lg-5\"><div class=\"input-group\"><span class=\"input-group-addon\">" +
				titleName +
				"</span> <input type=\"text\" class=\"form-control\" id=" +
				"\"" + "input_predict" + i + "\"" + "></div></div>";
		$("#predictdiv").append(html);
	}
	$("#predictdiv").append("<br><br>");
	$("#predictdiv").append("<div class=\"col-lg-5\"><button type=\"button\" class=\"btn btn-info\" onclick=\"doPredict()\">输出预测</button></div>");
	$("#predictdiv").append("<br><br>");
	
	for (var i=0;i<outputs.length;i++) {
		
		var titleName = outputs[i].innerHTML;
		var html = "<div class=\"col-lg-5\"><div class=\"input-group\"><span class=\"input-group-addon\">" +
				titleName +
				"</span> <input type=\"text\" class=\"form-control\" id=" +
				"\"" + "output_predict" +  "\"" + "></div></div>";
		$("#predictdiv").append(html);
	}
	
	$("#predictdiv").css("display","inline");
	
}


function doPredict() {
	var predict_input = $("#predictdiv input");
	var predictdata = "";
	for (var i=0;i<predict_input.length;i++) {
		if (predict_input[i].id.startsWith("input")){
			predictdata += predict_input[i].value;
			predictdata += ",";
		}
	}
	predictdata = predictdata.substring(0,predictdata.length-1);
	
	$.ajax({
		type: 'post',
		url:  'bp.predict',
		data: {predictdata: predictdata}, 
		success: function(data){
			$("#output_predict").val(Math.round(data*1000)/1000);
		},
		error: function(data){
			
		}
		
	})
}
