var bodyHeight= $(window).height();
var bodyWidth= $(window).width();
$(function(){
	//main.html获取nav 列表数据
	var navListData=$.parseJSON(topMenu);
	$("#nav").navTree(navListData);


	///左侧导航栏菜单
	$("#main_snav").accordion({

	});

	var frameHei = $(window).height() - 105;//定义iframe外层div高度
	//初始化首页div高度
	$("#main").height(frameHei);

	$("#logout").click(function(){//退出系统
		window.location.href = path + "/j_spring_security_logout";
	});
	////菜单下面的提示栏
	$('#nav1').html("");


	/////加载菜单？？？
	loadMenu(getCookie("topMenu_id"));

	//
	if (window.location.href.indexOf("homepage")>-1 || window.location.href.indexOf('.html')==-1) {
		$("#main_snav").remove();
		$('#main_body').css('width','100%');
		$("#nav").children("li").removeClass("cur");
		$("#manage_home").addClass("cur");
		$('#nav1').html("");
	}
});

/**
 * 点击菜单
 * @param resourceName
 * @param resourceUrl
 */
function loadURL(resourceCode,resourceUrl){
	window.location.href = path + resourceUrl;
	document.cookie = "leftMenu_id=" + resourceCode;
	document.cookie = "leftMenu_url=" + path + resourceUrl;

	///根据resourceCode,找到topMenu_id,防止浏览器多tab页面登录后导致menu混乱的问题
	setTopMenuId(getTopMenuId(resourceCode));
}

/**
 * ///根据resourceCode,找到topMenu_id,防止浏览器多tab页面登录后导致menu混乱的问题
 * @param resourceCode
 */
function getTopMenuId(resourceCode){
	var allAuth = $.parseJSON(authorities);
	var topMenu_id;///
	$(allAuth).each(function(index) {
		var twoMenu=this;
		if (resourceCode==twoMenu.resourceCode) {
			////如果当前resourceCode是顶级菜单，则返回，否则继续在判断其父菜单resourceCode
			if(resourceCode.indexOf("_")==-1){
				///子菜单的id都是下划线的格式如：a_b_c……
				topMenu_id = resourceCode;
			}else{
				topMenu_id = getTopMenuId(twoMenu.resourcePcode);
			}

		}
	});

	return topMenu_id;
}


/**
 * 加载左侧菜单
 * @param id
 */
function loadMenu(id){
	var allAuth=$.parseJSON(authorities);

	if (id=='manage_home'){
		$("#main_snav").remove();
		$('#main_body').css('width','100%');
	}else{
		var $nav = $("#" + id);
		//为顶部点中nav添加样式
		$("#nav").children("li").removeClass("cur");
		$nav.addClass("cur");
		//点击非首页，其他iframe显示，首页iframe隐藏
		$("#main").show();
		$("#main_body").show();

		//显示子菜单

		var accradiondata='';
		//移除所有的画板
		$($('#main_snav').accordion('panels')).each(function(index){
			$('#main_snav').accordion("remove",$(this).panel('options').title);
		});
		$(allAuth).each(function(index) {
			var twoMenu=this;
			if (id==twoMenu.resourcePcode) {
				if (accradiondata.indexOf('<ul')>-1){
					accradiondata='';
				}

				if (twoMenu.resourceUrl!='') {
					accradiondata +='<li><a id="'+twoMenu.resourceCode+'" onclick="loadURL(\''+twoMenu.resourceCode+'\',\''+twoMenu.resourceUrl+'\')" href="javascript:void(0);">'+twoMenu.resourceName+'</a></li>';
				}else{

					if (accradiondata.indexOf('<ul')==-1&&accradiondata!='') {
						accradiondata ='<ul>'+accradiondata+'</ul>';
						$("#main_snav").accordion('add',{
							title: $(accradiondata).find('a').text(),
							content: accradiondata,
							iconCls: "icon-ok",
							collapsible:true
						});
					}
					accradiondata ='<ul>';
					$(allAuth).each(function(index) {
						if (this.resourcePcode==twoMenu.resourceCode) {
							accradiondata +='<li><a id="'+this.resourceCode+'" onclick="loadURL(\''+this.resourceCode+'\',\''+this.resourceUrl+'\')" href="javascript:void(0);">'+this.resourceName+'</a></li>';
						}

					});
					accradiondata +='</ul>';

					$("#main_snav").accordion('add',{
						title: twoMenu.resourceName,
						content: accradiondata,
						iconCls: "icon-ok"
					});
				}
			}
		});
		if (accradiondata.indexOf('<ul')==-1) {
			accradiondata ='<ul>'+accradiondata+'</ul>';
			$("#main_snav").accordion('add',{
				title: $nav.text(),
				content: accradiondata
			});
		}

		var leftMenu = getCookie("leftMenu_id");

		var navStr = '';
		if ($nav.text()!='') {
			navStr+='<span>'+$nav.text()+'</span>';
		}
		if (leftMenu && $('#'+leftMenu).parent().parent().parent().parent().find('.panel-title').text()!='') {
			navStr+=' &gt; <span>'+$('#'+leftMenu).parent().parent().parent().parent().find('.panel-title').text()+'</span>';
			$("#main_snav").accordion('select',$('#'+leftMenu).parent().parent().parent().parent().find('.panel-title').text());
		}else if(!leftMenu){
			navStr+=' &gt; <span>'+$('#main_snav .panel-title:eq(0)').text()+'</span>';
			$("#main_snav").accordion('select',$('#main_snav .panel-title:eq(0)').text());
		}
		if (leftMenu && $('#'+leftMenu).text()!='') {
			navStr+=' &gt; <span><a href="'+getCookie("leftMenu_url")+'">'+$('#'+leftMenu).text()+'</a></span>';
			$('#'+leftMenu).parent().addClass('cur');
		}else if(!leftMenu){
			navStr+=' &gt; <span><a href="'+$('#main_snav li:eq(0) a').attr('href')+'">'+$('#main_snav li:eq(0)').text()+'</a></span>';
			$('#main_snav li:eq(0)').addClass('cur');
		}
		if (navStr!='') {
			navStr='<b>当前位置：</b> '+navStr;
		}
		$('#nav1').html(navStr);
	}
}

//navlist 点击事件
function navHref(id){
	debugger;
	delCookie('leftMenu_id');
	delCookie('topMenu_id');
	var firstMenuUrl = '';
	//首页
	if (id=='manage_home') {
		firstMenuUrl = '/layout.homepage.html';
	}else{
		var allAuth=$.parseJSON(authorities);
		$.each(allAuth,function(index){
			var twoMenu=this;
			if (id==twoMenu.resourcePcode) {
//				alert(twoMenu.resourceCode+'==='+twoMenu.resourceUrl);
				if (firstMenuUrl!='') {
//					alert('ting');
					return false;
				}
				if (twoMenu.resourceUrl != '') {
//					alert(1);
					firstMenuUrl=twoMenu.resourceUrl;
					return false;
				}else{
//					alert(2);
					$.each(allAuth,function(index) {
						if (twoMenu.resourceCode==this.resourcePcode) {
//							alert(this.resourceCode+'==='+this.resourceUrl);
							if (this.resourceUrl != '') {
								firstMenuUrl=this.resourceUrl;
//								alert(firstMenuUrl);
								return false;
							}
						}
					});
				}
			}
		});
	}
	window.location.href=path +firstMenuUrl;
	///保存topMenu_id
	setTopMenuId(id);
}

/**
 * 代办查看链接跳转
 * @param id
 * @param url
 */
function navHrefToDo(id,url,event_obj){
	delCookie('leftMenu_id');
	//首页
	var allAuth=$.parseJSON(authorities);
	$(allAuth).each(function(index) {
		if (this.resourceUrl==url) {
			document.cookie = "leftMenu_id=" + this.resourceCode;
			return false;
		}
	});
	window.location.href=path +url + "?event_obj=" + event_obj;
	setTopMenuId(id);
}

/**
 * 存储topMenu_id到cookie中
 * @param id
 */
function setTopMenuId(id){
	////增加path属性，防止cookie删除和覆盖不了的问题
	document.cookie = "topMenu_id=" + id + ";path=/";
}
