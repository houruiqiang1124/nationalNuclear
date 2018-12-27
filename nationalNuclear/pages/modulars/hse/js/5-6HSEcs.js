var _this = null;
new Vue({
    el: "#app",
    data: {
        users: [],
        forwardParam: {},
        checkedUser: {
            	memberId:"",
            	memberName:""
        },    // 选中人员
        serchVal: ""
    },
    mounted: function() {
        _this = this;
        function plusReady() {
            console.log(JSON.stringify(plus.webview.currentWebview().params))
        	_this.forwardParam = plus.webview.currentWebview().params;
            _this.getCopyPerson();
        }
        if (window.plus) {
        	plusReady()
        } else {
        	document.addEventListener('plusready', plusReady, false);
        }
    },
    methods: {
        // 确定
        ok: function() {
            this.forwardParam.userId = app.loginInfo.userId;
            this.forwardParam.userName = app.loginInfo.userName;
            this.forwardParam.ownerUserId = this.checkedUser.memberId;
            this.forwardParam.ownerUserName = this.checkedUser.memberName;
            console
            if(_this.checkedUser.memberId == "" && _this.checkedUser.memberName =="") {
            	mui.alert("请选取人员");
            	return;
            }
            app.ajax({
                url: app.INTERFACE.findForwarding,
                data: this.forwardParam,
                success: function(res) {
                    plus.webview.getWebviewById("5-10HSE.html").hide();
                    plus.webview.getWebviewById("5-10HSE.html").close();
                    var webview = plus.webview.getWebviewById("5-0HSE.html");
                    var number=0;
                    mui.fire(webview,'refresh',{
                    	number:number
                    });
                    mui.back();
                    
                    mui.toast("转发成功");
                }
            })
        },
        // 取消
        cancel: function() {
            mui.back();
        },
        radioChange: function(e) {
            $('input[type=radio]').attr("checked", false);
            $('input[type=radio][name='+e.value+']').attr("checked", true);
            _this.checkedUser = e;
        },
        //获取抄送人列表
        getCopyPerson:function(){
        	var param ={
        		"projNo": app.loginInfo.projNo,
        		// "userName": app.loginInfo.userName
        		"userName": ""
        	}
        	app.ajax({
        			url: app.INTERFACE.getCopyPerson,
        			data: param,
        			success: function(res) {
        				_this.users = res.beans;
        			}
        	})
        },
        // 搜索人员
        searchBtn: function() {
        	var param = {
        		"projNo": app.loginInfo.projNo,
        		// "userName": app.loginInfo.userName
        		"userName": _this.serchVal
        	}
        	app.ajax({
        		url: app.INTERFACE.getCopyPerson,
        		data: param,
        		success: function(res) {
        			_this.users = res.beans;
        		}
        	})
        },
        // 重置
        reset: function() {
        	_this.serchVal = "";
        }
    }
})