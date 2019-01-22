(function(m, app) {
    const host = "http://10.4.210.110:8081/";  // 测试服务器
    // var host = "http://192.168.199.4:8888/";
    // const host = "http://39.105.204.84:8888/";  // 正式

	app.portalUrl = "http://10.4.200.77";
	app.vpnUrl = "https://vpn.snpec.com.cn";
	app.vpnUsername="appuser";
	app.vpnPassword="1!qQ1111";
	app.vpnRsa="";
	app.mkeyUrl = "http://10.4.210.112:8080/snpec/";
    app.protal = "http://10.4.200.59";//门户地址
    
    // 登录信息
    var loginInfo = localStorage.getItem("loginInfo");
    app.loginInfo = JSON.parse(loginInfo) || {};
    
    app.INTERFACE = {
		//适配接口
		checkCodeUrl:'/snpec_portal/command/dispatcher/org.loushang.bsp.security.web.RandomCodeCommand?_dc=', // 获取验证码
		companyNewUrl: app.portalUrl + '/snpec_portal/jsp/com/snpit/top/portal/snpecportal/qiyeMore.jsp?systype=6',  // 公司要闻
        noticeUrl: app.portalUrl+'/snpec_portal/jsp/com/snpit/top/portal/snpecportal/qiyeMore.jsp?systype=5',   // 公告列表
		employeesGoUrl: app.portalUrl+'/snpec_portal/jsp/com/snpit/top/portal/snpecportal/yggoMore.jsp?systype=5',//员工去向
        companyNewUrlSearch:app.portalUrl+ "/snpec_portal/command/dispatcher/com.snpit.top.portal.snpecportal.cmd.HomePageQueryCommand/queryGroupForMore",  // 要闻搜索
		noticeSearchUrl: app.portalUrl+'/snpec_portal/command/dispatcher/com.snpit.top.portal.snpecportal.cmd.HomePageQueryCommand/queryGroupForMore',//公告搜索和上下拉
		employeesGoSearchUrl: app.portalUrl+'/snpec_portal/command/dispatcher/com.snpit.top.portal.snpecportal.cmd.HomePageQueryCommand/queryYgGOForMore',//员工去向搜索和上下拉
        daiBan: app.portalUrl+'/snpec_portal/jsp/com/snpit/top/portal/snpecportal/gerenMore.jsp?systype=daiban',    // 统一待办
        daiBanPull: app.portalUrl+'/snpec_portal/command/dispatcher/com.snpit.top.portal.snpecportal.cmd.HomePageQueryCommand/queryDaiBan', // 待办事项上下拉  
		//hse接口
        findToDo: 'processStatus/findToDo',  // hse列表
        hseBadge: 'processStatus/findProcessStatusCount', // 角标
        insertCheck: 'checkList/insertCheck',   // 新建检查的提交和保存
        hseCirculation: 'processStatus/findTransferInformation',  // 流转信息
        selectDanger: 'checkList/selectDanger', // 查询隐患详细信息
        delCheckAndDanger: 'checkList/delCheckAndDanger',   // hse列表草稿删除
        findForwarding: 'forwarding/findForwarding',    // 整改节点转发
        changeSubmit: "checkList/changeSubmit",  // 整改节点提交
        findWithdrawTerminate: "withdrawTerminate/findWithdrawTerminate",    // 流程撤回
        findFefund: 'forwarding/findFefund',    // 待办退回
        draftsSave: "drafts/draftsSave",   // 草稿保存
        draftsSubmit: "drafts/draftsSubmit",    // 草稿提交
        findDelayToApplyFor: "delayToApplyFor/findDelayToApplyFor",  // 延期申请
        verification: "sumbit/verification" ,// 整改验证通过与不通过
        checkPass: "drafts/checkPass",  // 延期申请的通过与不通过
        getArea: "webService/getAreaList",  // 获取区域
        getUnit: "webService/getUnit",  // 获取机组
        getInspectedUnit: "webService/getInspectedUnit",    // 获取被检查单位
        getHazardTypeList: "webService/getHazardTypeList",    // 获取隐患类型
        getCopyPerson: "webService/getCopyPerson",    // 获取抄送人列表
        getDraftUnitList: "webService/getDraftUnitList",    // 获取责任单位列表
        getProjectList: "webService/getProjectList",    // 获取项目
        updateHaveRead: "processStatus/updateHaveRead", // 点击已阅
		webServiceLogin:"webService/getUserMsg",
        retResubmit: "sumbit/retResubmit",   // 代办退回后的提交
        findDelayNum: "delayToApplyFor/findDelayNum",    // 延期申请次数
        getHesUserInif: "webService/getHesUserInif",
		imgUplodNew: host+"uploadPhoto/uploadPicture",//新建上传服务器图片
		imgUplodChange: host+"uploadPhoto/uploadRectifyFile",//整改上传服务器图片
        imgUplodNews: host+"uploadPhotos/uploadPictureFiles",//新建上传服务器图片
		imgUplodChanges: host+"uploadPhotos/uploadRectifyFiles",//整改上传服务器图片
        
    }
    
    /**
     * @params {Object} option
     * option.url路径 
     * option.data参数 
     * option.method请求方式 
     * option.success成功回调函数 
     */
    app.ajax = function(option) {
        plus.nativeUI.showWaiting();
        console.log('【参数】' + JSON.stringify(option));
        mui.ajax(host + option.url,{
        	data:  option.data || {},
        	dataType:'json',//服务器返回json格式数据
        	type:option.method || 'POST',//HTTP请求类型
        	timeout:50000,//超时时间设置为10秒；
            headers: {
            	'Content-Type': 'application/json'
            },
        	success:function(res){
                console.log('【请求地址】'+ host + option.url)
                console.log("【请求成功】" + JSON.stringify(res))
				if(!res.object && option.url == "webService/getUserMsg"){
					option.success(res);
					return;
				}
        		if(res.object.resultCode == 0 || res.object.rtnCode == 0 ) {
                    option.success(res);
                } else {
                    option.success(res);
                }
                plus.nativeUI.closeWaiting();
        	},
        	error:function(xhr,type,errorThrown){
                plus.nativeUI.closeWaiting();
                if(typeof option.error == "function") {
                    option.error(xhr,type,errorThrown)
                }
                console.error('【请求错误地址】'+ host + option.url)
        		console.error('【请求错误】' + JSON.stringify(type))
        	}
        });
    }
}(mui, window.app = {}))