var projectId = 0;//项目Id
var projectName;//项目名
var appResult = null;//word报告
var appName = "bpNetWork";//将demo改为app名称，与数据库中表名字一致（必填）
var appNameChinese = '神经网络预测';//app中文名（必填）
var USER_NAME = '';//当前登录用户名
var customText = {//word编辑区自定义文本内容
    'title': "<h2>1 神经网络预测结果 </h2>",
    
    'chap1': "<h3>1.1 神经网络的收敛曲线</h3>",
    'img1': "",
    'chap2': "<h3>1.2 神经网络预测结果</h3>",
    'result': "<h3> </h3>"
};
console.log("模板层Id为：" + tempProjectID);//当前模板项目ID


var projectEditStatus = false;

//添加项目后，自定义操作
function addSelfDefine(result) {
    //上一层函数查看basicAction.js中addProject()函数
    /*
    * your code.....
    **/
	projectEditStatus = false;
	setDefaultCofig();
	generateTable();
	
    console.log("add project successful");
}

// 查看项目后，自定义操作
function checkSelfDefine(node,result) {
    // 上一层函数查看basicAction.js中checkProject()函数
    /*
    * your code.....
    **/
	var appContent = result.content.appContent;
	projectEditStatus = false;
	
	if (appContent=="") { //无数据
		setDefaultCofig();
		generateTable();
		//$('#myBootstrapTtable').bootstrapTable('removeAll');
		return;
	}
	
	var alldata = JSON.parse(appContent);
	var title = alldata.title;
	var tabledata = alldata.tabledata;
	
	//读取网络配置信息
	if (title.length > 0) {
		$("#inputs").empty();
		var t = 0;
		for (; t < title.length-1; t++) {
			addInputElement(title[t]);
		}
		$("#outputs").empty();
		addOutputElement(title[t]);
	} else {
		setDefaultCofig();
	}
	
	generateTable();

	//读取训练集数据
	if (tabledata.length > 0) {
		projectEditStatus = true;
		$('#myBootstrapTtable').bootstrapTable('removeAll');
		for (var i=0;i<tabledata.length;i++) {
			$('#myBootstrapTtable').bootstrapTable('append', tabledata[i]);
		}
	}
	
	
    console.log("check project successful");
}



//删除项目后，自定义操作
function removeSelfDefine(result) {
    // 上一层函数查看basicAction.js中removeProject()函数
    /*
    * your code.....
    **/
	
    console.log("remove project successful");
}



//保存项目
function saveProject() {
    if (projectId === 0) {
        alert("项目保存只是针对已存在项目，请新建项目或者另存项目");
    } else {
        checkSave = 1;//点击word编辑区可以插入新图片
        var columns = $('#myBootstrapTtable').bootstrapTable("getOptions").columns;
        var title = new Array();
        for (var i=1;i<columns[0].length-1;i++) {
        	title.push(columns[0][i].title.replace(/[\r\n]/g,""));
        }
        var tabledata = $('#myBootstrapTtable').bootstrapTable('getData');
        var alldata = {
        		title:title,
        		tabledata:tabledata
        }
        var data = {
            "id": projectId,
            "appContent": JSON.stringify(alldata)
        };
        $.ajax({
            type: "PUT",
            url: "/projectManager/api/v1/project",
            data: data,
            success: function (result) {
                console.log(result.state);
                alert("当前项目保存成功");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.log("XMLHttpRequest请求状态码：" + XMLHttpRequest.status);
                console.log("XMLHttpRequest状态码：" + XMLHttpRequest.readyState);
                console.log("textStatus是：" + textStatus);
                console.log("errorThrown是：" + errorThrown);
                alert("获取项目失败，请稍后重试!");
            }
        });
    }
}





//另存项目
function saveAsProject() {
    var saveProjectNameArr = [];//获取所有项目
    // 获取输入框中的内容
    var projectName = $('#saveAsProjectNameModal')[0].value;//获取项目名
    var createDate = new Date().toLocaleDateString() + ',' + new Date().getHours() + ':' + new Date().getMinutes();//获取项目创建时间
    var memo = $('#saveAsProjectRemarkModal')[0].value;//获取备注
   
    
    
    var columns = $('#myBootstrapTtable').bootstrapTable("getOptions").columns;
    var title = new Array();
    for (var i=1;i<columns[0].length-1;i++) {
    	title.push(columns[0][i].title.replace(/[\r\n]/g,""));
    }
    var tabledata = $('#myBootstrapTtable').bootstrapTable('getData');
    var alldata = {
    		title:title,
    		tabledata:tabledata
    }
    var data = {
        "id": 0,
        "createDate": createDate,
        "projectName": projectName,
        "memo": memo,
        "appContent": JSON.stringify(alldata)
    };
    
//获取数据库所有项目名
    $.ajax({
        url: "/projectManager/api/v1/project",
        type: "get",
        async: false,
        dataType: "json",
        success: function (result) {
            saveProjectNameArr.length = 0;//数组清零
            result.content.forEach(function (element, index, array) {
                saveProjectNameArr.push(element.projectName);
            })
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {//打印错误信息
            console.log("XMLHttpRequest请求状态码：" + XMLHttpRequest.status);
            console.log("XMLHttpRequest状态码：" + XMLHttpRequest.readyState);
            console.log("textStatus是：" + textStatus);
            console.log("errorThrown是：" + errorThrown);
        }
    });
    //表格添加数据
    if (projectName === '') {
        alert("请输入项目名！！！");
    } else if (saveProjectNameArr.indexOf(projectName) !== -1) {
        alert("项目已经存在，请重新输入项目名！！！");
    } else {
        // 添加数据库
        $.ajax({
            type: "post",
            url: "/projectManager/api/v1/project",
            data: data,
            success: function (result) {
                if (result.state) {
                    $('.selectList').prepend('<li class="">\n' +
                         '\t\t\t\t\t<a>\n' +
                         '\t\t\t\t\t\t<div>\n' +
                         '\t\t\t\t\t\t\t<div class="sideProjectLi" onmouseover="this.title = this.innerHTML;" onclick="sideCheck(' + result.content.id + ',this)">\n' +
                         '\t\t\t\t\t\t\t\t' + result.content.projectName + '\n' +
                         '\t\t\t\t\t\t\t</div>\n' +
                         '\t\t\t\t\t\t\t<div style="position:absolute;bottom:6px;right:5px;">\n' +
                         '\t\t\t\t\t\t\t\t<i class="ace-icon fa fa-pencil align-top bigger-125 purple" id="checkSideLi" onclick="checkProject(' + result.content.id + ')" data-toggle="modal" data-target="#basicInfo"></i>\n' +
                         '\t\t\t\t\t\t\t\t<i class="ace-icon fa fa-trash-o bigger-120 red" id="deleteSideLi" onclick="removeProject(' + result.content.id + ')"></i>\n' +
                         '\t\t\t\t\t\t\t</div>\n' +
                         '\t\t\t\t\t\t</div>\n' +
                         '\t\t\t\t\t</a>\n' +
                         '\t\t\t\t</li>');
                    //侧边栏高度适应
                    var height = $(window).get(0).innerHeight;//获取屏幕高度
                    if ($('#cityList').children('li').length * 36 < height - 310) {
                        $('.selectList').css('height', $('#cityList').children('li').length * 36);
                    } else {
                        $('.selectList').css('height', height - 310);
                    }
                    $('#dynamic-table').DataTable().row.add(data).draw(false);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {//打印错误信息
                console.log("XMLHttpRequest请求状态码：" + XMLHttpRequest.status);
                console.log("XMLHttpRequest状态码：" + XMLHttpRequest.readyState);
                console.log("textStatus是：" + textStatus);
                console.log("errorThrown是：" + errorThrown);
            }
        });
        $('#saveAsModal').modal('hide');//隐藏模态框
        // 在前台添加表格
    }
}











//定制初始化内容
function setCustomContext() {
	
	var img1 = $("canvas")[0];  //选择页面中的img元素
    var image1 = new Image();
    if (img1 != null) {
        image1.src = img1.toDataURL("image/png");
    }
    
    
    customText.img1 = image1;
    
    var bpres = $("#output_predict").val();
    customText.result = "<h3>输出预测为    "+ bpres + "</h3>";
    
    for (var custom in customText) {
        $('#WYeditor').append(customText[custom]);
    }

	
}