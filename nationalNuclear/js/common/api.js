


(function(m, app) {
    // const host = "http://192.168.43.107:8888/";  // 测试服务器
    var host = "http://192.168.199.7:8888/";
    // const host = "http://39.105.204.84:8888/";  // 正式
	app.portalUrl = "http://10.4.200.77";
	app.vpnUrl = "https://vpn.snpec.com.cn";
	app.vpnUsername="appuser";
	app.vpnPassword="1!qQ1111";
	app.vpnRsa="";
    
    var INTERFACE = {
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
        getArea: "webServise/getAreaList",  // 获取区域
        getUnit: "webServise/getUnit",  // 获取机组
        getInspectedUnit: "webServise/getInspectedUnit",    // 获取被检查单位
        getHazardTypeList: "webServise/getHazardTypeList",    // 获取隐患类型
        getCopyPerson: "webServise/getCopyPerson",    // 获取抄送人列表
        getDraftUnitList: "webServise/getDraftUnitList",    // 获取责任单位列表
        updateHaveRead: "processStatus/updateHaveRead", // 点击已阅
    }
    
    /**
     * @params {Object} option
     * option.url路径 
     * option.data参数 
     * option.method请求方式 
     * option.success成功回调函数 
     */
    app.ajax = function(option) {
        console.log('【参数】' + JSON.stringify(option));
        mui.ajax(host + option.url,{
        	data: option.data || {},
        	dataType:'json',//服务器返回json格式数据
        	type:option.method || 'POST',//HTTP请求类型
        	timeout:10000,//超时时间设置为10秒；
        	success:function(res){
        		if(res.data.object.resultCode == 0 || res.data.object.rtnCode == 0) {
                    option.success(res);
                } else {
                    option.success(res);
                }
        	},
        	error:function(xhr,type,errorThrown){
        		
        	}
        });
    }
}(mui, window.app = {}))