$(function(){
	/*$.ajax({
		type : "POST",
		url : path + '/admin/getCount4CrowdfundSys',
		success : function(data) {
			$("#statistic label").each(function(){
				$(this).text(data[this.id]);
			});
		}
	});
	*/
	//加载最新操作日志
	$.ajax({
		type : "POST",
		url : path + '/user/getTodayNew',
		dataType:'json',
		success : function(data) {
			$("#todayUser").html('<font color="red" >'+data.addusers+'</font');
			$("#todayCards").html('<font color="red" >'+data.addcards+'</font');
		}
	});
    
	
	var columns_log = [[
	                {field:'userId',title:'用户名',width:69,align:'center'},
	                {field:'operateTime',title:'操作时间',width:132,align:'center',formatter:function(value){
	                	var date = new Date(value);
	                	var pattern = "yyyy-MM-dd hh:mm:ss"; 
	                	return date.format(pattern);
	                }},
	                {field:'ipAddress',title:'IP',width:91,align:'center'},
	                {field:'operateModeText',title:'操作模块',width:67,align:'center'},
	                {field:'operateTypeText',title:'类别',width:60,align:'center'},
	                {field:'operateResult',title:'结果',width:40,align:'center',formatter:function(value,row,index){
						if (row.operateResult == "success") {
							return '成功';
						}else{
							return '失败';
						}
					}},
					{field:'resInfo',title:'描述',fitColumns:true,align:'center'}
	                ]];
	$('#operateLog').datagrid({
		url: path + '/log/getOperateLoglist',
		columns: columns_log,
		queryParams:{
			'userId':adminId
		},
		pagination: true,
		height : 310,
		width:800,
		rownumbers : true,
		striped : true,
		singleSelect: true
	});
	
	
	//修改邮箱
	$('#emailBtn').click(function(){
		$("#emailWin").show().dialog({
			title: "修改邮箱",
			height: 300,
			width: 500,
			modal : true,
			onClose: function () {
	            $("#emailForm").form('clear').form('reset');
	        }
		});
	});
	
	//关闭修改邮箱
	$("#emailCloseBtn").click(function(){
		$("#emailWin").dialog('close');
	});
	
	//保存修改邮箱
	$("#emailForm").validate({
		errorPlacement : function(error, element) {
			if (element.parent().hasClass("yzm")) {
				error.appendTo(element.parent().parent().next().show());
			}else{
				error.appendTo(element.parent().next().show());
			}
    	},
		rules : {
			emailOldVerifyCode : "required",
			newEmail : {
				required:true,
				email:true
			},
			emailNewVerifyCode : "required"
		},
		messages : {
			emailOldVerifyCode : "请填写邮箱验证码",
			newEmail : {
				required:"请填写新邮箱"
			},
			emailNewVerifyCode : "请填写邮箱验证码"
		},
        submitHandler:function(form){
    		$('#emailForm').form('submit', {
    			url : path + '/admin/modifyEmail',
    			queryParams: {
    				'oldEmail':$('#oldEmail').val()
    			},
    			success : function(data) {
    				data = $.parseJSON(data);
    				if (data.success) {
    					$('#emailLi').html($('#newEmail').val());
    					$("#emailWin").dialog('close');
    				}
    				if (!data.success) {
    					$.messager.alert('提示',data.msg);
    				}
    			}
    		});
        }
    }); 
	
	//保存修改邮箱
	$("#emailSaveBtn").click(function(){
		$('#emailForm').submit();
	});
	
	
	
	//修改手机号
	$('#phoneBtn').click(function(){
		$("#phoneWin").show().dialog({
			title: "修改手机号",
			height: 300,
			width: 500,
			modal : true,
			onClose: function () {
	            $("#phoneForm").form('clear').form('reset');
	        }
		});
	});
	
	//关闭修改手机号码
	$("#phoneWin #closeBtn").click(function(){
		$("#phoneWin").dialog('close');
	});
	
	//发送修改手机号验证码
	function getVerifyCode(){
		$.ajax({
			url: path+'/verifycode/sendVerifyCode',
			type: "post",
			dataType: "json",
			data: {
				'messageNodeCode':'reset_login_password_by_mobile_for_admin',
				'mobileNumber':$('#mobile').val()
			},
			success: function(data){},
			error: function(){}
		});
	}
	
	//保存修改手机号码
	$("#phoneForm").validate({
		errorPlacement : function(error, element) {
			if (element.parent().hasClass("yzm")) {
				error.appendTo(element.parent().parent().next().show());
			}else{
				error.appendTo(element.parent().next().show());
			}
    	},
		rules : {
			oldVerifyCode : "required",
			newMobile : {
				required:true,
				mobile:true
			},
			newVerifyCode : "required"
		},
		messages : {
			oldVerifyCode : "请填写短信验证码",
			newMobile : {
				required:"请填写新手机号"
			},
			newVerifyCode : "请填写短信验证码"
		},
        submitHandler:function(form){
        	if ($('#newMobile').val()==$('#oldMobile').val()) {
        		$.messager.alert('提示', '新手机号不能和原手机号一致');
        		return false;
        	} else {
	    		$('#phoneForm').form('submit', {
	    			url : path + '/admin/modifyMobile',
	    			queryParams: {
	    				'oldMobile':$('#oldMobile').val()
	    			},
	    			success : function(data) {
	    				data = $.parseJSON(data);
	    				if (data.success) {
	    					$('#phoneLi').html($('#newMobile').val());
	    					$("#phoneWin").show().dialog('close');
	    				}
	    				if (!data.success) {
	    					$.messager.alert('提示',data.msg);
	    				}
	    			}
	    		});
        	}
        }
    }); 
	
	$('#phoneSaveBtn').click(function() {
		$('#phoneForm').submit();
	});
	
	//修改密码
	$('#passBtn').click(function(){
		$("#passWin").show().dialog({
			title: "修改密码",
			height: 300,
			width: 550,
			modal : true,
			onClose: function () {
	            $("#passForm").form('clear').form('reset');
	        }
		});
	});
	
	//关闭修改密码
	$("#pwdCloseBtn").click(function(){
		$("#passWin").dialog('close');
	});
	
	$("#passForm").validate({
		rules : {
			oldPassword : "required",
			newPassword : {
				required:true,
				securityPass:true
			},
			confirmPassword : {
				required:true,
				equalTo:'#newPassword'
			}
		},
		messages : {
			oldPassword : "请填写旧密码",
			newPassword : {
				required:"请填写新密码",
				securityPass:"密码要求6-16个字符，由大小写字母、数字和符号两种及以上组合"
			},
			confirmPassword : {
				required:"请输入确认密码",
				equalTo:"两次输入密码不一致"
			}
		},
        submitHandler:function(form){
        	$('#passForm').form('submit', {
    			url : path + '/admin/modifyPassword',
    			queryParams: {
    				'adminId':adminId
    			},
    			success : function(data) {
    				data = $.parseJSON(data);
    				if (data.success) {
    					$("#passWin").dialog('close');
    					$.messager.alert('提示','密码修改成功');
    				}
    				if (!data.success) {
    					$.messager.alert('提示',data.msg);
    				}
    			}
    		});
        }
    }); 
	
	//保存修改密码
	$("#pwdSaveBtn").click(function(){
		$("#passForm").submit();
	});
});


//获取短信验证码
function getOldAuthCode(){
	$.ajax({
		url: path+'/verifycode/sendVerifyCode',
		type: "post",
		dataType: "json",
		data: {
			'messageNodeCode':'modify_mobile_by_mobile_for_admin',
			'mobileNumber':$('#oldMobile').val(),
			'userId':adminId
		},
		success: function(data){
			if (!data.success) {
				$.messager.alert('提示',data.msg);
			}
		},
		error: function(){
			
		}
	});
	sendAuthCode('oldVerifyCode');
}


//获取短信验证码
function getNewAuthCode(){
	if ($('#oldVerifyCode').val()=='') {
		$.messager.alert('提示', '请先输入原手机号短信验证码');
		return false;
	}
	if ($('#newMobile').val()==$('#oldMobile').val()) {
		$.messager.alert('提示', '新手机号不能和原手机号一致');
		return false;
	}
	if ($('#newMobile').val()=='') {
		$.messager.alert('提示', '请输入新手机号');
		return false;
	}
	$.ajax({
		url: path+'/verifycode/sendVerifyCode',
		type: "post",
		dataType: "json",
		data: {
			'messageNodeCode':'bind_mobile_for_admin',
			'mobileNumber':$('#newMobile').val(),
			'userId':adminId
		},
		success: function(data){
			if (!data.success) {
				$.messager.alert('提示',data.msg);
			}
			if (data.success) {
				sendAuthCode('newVerifyCode');	
			}
		},
		error: function(){
			
		}
	});
}


//获取邮箱验证码
function getOldEmailAuthCode(){
	$.ajax({
		url: path+'/verifycode/sendEmailVerifyCode',
		type: "post",
		dataType: "json",
		data: {
			'messageNodeCode':'modify_mobile_by_mobile_for_admin',
			'email':$('#oldEmail').val(),
			'userId':adminId
		},
		success: function(data){
			if (!data.success) {
				$.messager.alert('提示',data.msg);
			}
			if(data.success){
				sendAuthCode('emailOldVerifyCode');
			}
		},
		error: function(){
			
		}
	});
}
//获取邮箱验证码
function getNewEmailAuthCode(){
	if ($('#newEmail').val()=='') {
		$.messager.alert('提示', '请输入新邮箱地址');
		return false;
	}
	$.ajax({
		url: path+'/verifycode/sendEmailVerifyCode',
		type: "post",
		dataType: "json",
		data: {
			'messageNodeCode':'bind_mobile_for_admin',
			'email':$('#newEmail').val(),
			'userId':adminId
		},
		success: function(data){
			if (!data.success) {
				$.messager.alert('提示',data.msg);
			}
			if(data.success){
				sendAuthCode('emailNewVerifyCode');
			}
		},
		error: function(){
			
		}
	});
}