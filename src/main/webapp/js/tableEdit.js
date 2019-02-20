




function generateTable() {
		if (projectEditStatus) {
			return;
		}
	
		$('#myBootstrapTtable').bootstrapTable('destroy');
		
		var inputs = $("#inputs").find("span.editable");
		var outputs = $("#outputs").find("span.editable");
		var tableColumns = new Array();
		
		//添加删除
		tableColumns.push(
				{ field:'state',
				  checkbox:"true",
			     });
		
		
		for (var i=0;i<inputs.length;i++) {
			var titleName = inputs[i].innerHTML;
			tableColumns.push({field: 'input'+i,
		        title: titleName});
		}
		for (var i=0;i<outputs.length;i++) {
			var titleName = outputs[i].innerHTML;
			tableColumns.push({field: 'output'+i,
		        title: titleName});
		}
		
		//添加编辑
		tableColumns.push(
				{ field:'action',
				  formatter:"actionFormatter",
			      events:"actionEvents",
	              title: "编辑"});
		
		$('#myBootstrapTtable').bootstrapTable({
			columns: tableColumns,
		});
}



function addrow() {
	$("#inputItemAdd").empty();
	$("#outputItemAdd").empty();
	$("#inputItemAdd").append("<h5 style=\"padding-left:10px\">网络输入数据</h5>");
	$("#outputItemAdd").append("<h5 style=\"padding-left:10px\">网络输出数据</h5>");
	
	var allcolumns = $('#myBootstrapTtable').bootstrapTable('getVisibleColumns');
	
	for (var i=0;i<allcolumns.length;i++) {
		var html = "<div class=\"col-lg-6\"> <div class=\"input-group\"> <span class=\"input-group-addon\">" +
				allcolumns[i].title +
				"</span> <input type=\"text\" class=\"form-control\" id=\"" +
				allcolumns[i].field +
				"\"</div></div>";
		if (allcolumns[i].field.startsWith("input")) {
			$("#inputItemAdd").append(html);
		} 
		if (allcolumns[i].field.startsWith("output")) {
			$("#outputItemAdd").append(html);
		}
	}
	
	
	$('#itemAdd').modal('show');
}




//工序自动生成，选择行的index为工序号
function generateId(value,row,index) {
	return index+1;
}

function addItem() {
	
	if (checkInput()) {
		var allcolumns = $('#myBootstrapTtable').bootstrapTable('getVisibleColumns');
		rowdata = new Object();
		for (var i=0;i<allcolumns.length;i++) {
			if (allcolumns[i].field.startsWith("input") || allcolumns[i].field.startsWith("output")) {
				rowdata[allcolumns[i].field] = $("#"+allcolumns[i].field).val();
			}
		}
		$('#myBootstrapTtable').bootstrapTable('append', rowdata);
		
		//设置开关量，实现保存数据库与修改同步
		$('#saveProject').val("false");
	}
	
}


function actionFormatter(value, row, index) {
    return [
        '<a class="edit ml10" href="javascript:void(0)" title="Edit">',
        '<i class="glyphicon glyphicon-edit"></i> 编辑',
        '</a>'
    ].join('');
}
var updateindex = 1;

window.actionEvents = {
    'click .edit': function (e, value, row, index) {
    	
    	$("#dataEditGroup").empty();
    	var allcolumns = $('#myBootstrapTtable').bootstrapTable('getVisibleColumns');
		
		for (var i=0;i<allcolumns.length;i++) {
			if (allcolumns[i].field.startsWith("input") || allcolumns[i].field.startsWith("output")) {
				var title = allcolumns[i].title;
				var id = allcolumns[i].field;
				var value = row[id];
				var html = "<div class=\"col-lg-6\"><div class=\"input-group\"><span class=\"input-group-addon\">" +
							title +
						   "</span> <input type=\"text\" class=\"form-control\" value =\"" + value + "\"id=\"" + id +"\"></div></div>"
			   $("#dataEditGroup").append(html);
			}
		}
    	
    	$('#itemEdit').modal('show');
    	updateindex = index;
    
    
    }
 };


function editItem() {
	
	if (checkInput1()) {
		$('#itemEdit').modal('hide');
		////更改表格数据
		var rowdata = new Object();
		var updates = $("#dataEditGroup input");
		for (var i=0;i<updates.length;i++) {
			rowdata[updates[i].id] = updates[i].value;
		}
		$('#myBootstrapTtable').bootstrapTable('updateRow',{index: updateindex, row: rowdata});
		$('#saveProject').val("false");
	}
}


function deleterow() {
	
	//遍历数组中的每个元素，并按照return中的计算方式 形成一个新的元素，放入返回的数组中
	var ids = $.map($('#myBootstrapTtable').bootstrapTable('getSelections'), function (row) {
        return row.state;
    });
	$('#myBootstrapTtable').bootstrapTable('remove', {field: 'state', values: ids});
	
	$('#saveProject').val("false");

}

function checkInput() {
	
	var allcolumns = $('#myBootstrapTtable').bootstrapTable('getVisibleColumns');
	for (var i=0;i<allcolumns.length;i++) {
		if (allcolumns[i].field.startsWith("input") || allcolumns[i].field.startsWith("output")) {
			var data =  $("#"+allcolumns[i].field).val();
			
			if (data.trim()=="") {
				alert('内容不能为空');
				return false;
			}
			if (! Number(data)) {
				alert('请输入数字');
				return false; 
			}
		}
	}
	return true;
}

function checkInput1() {
	
	var updates = $("#dataEditGroup input");
	for (var i=0;i<updates.length;i++) {
		var data  = updates[i].value;
		if (data.trim()=="") {
			alert('内容不能为空');
			return false;
		}
		if (! Number(data)) {
			alert('请输入数字');
			return false;
		}
	}
	return true;
}


