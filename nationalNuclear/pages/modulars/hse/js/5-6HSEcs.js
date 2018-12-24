var _this = null;
new Vue({
    el: "#app",
    data: {
        users: [],
        forwardParam: {},
        checkedUser: {}    // 选中人员
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
            this.forwardParam.ownerUserId = this.checkedUser.value;
            this.forwardParam.ownerUserName = this.checkedUser.text;
            app.ajax({
                url: app.INTERFACE.findForwarding,
                data: this.forwardParam,
                success: function(res) {
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
        				var List = res.beans.map((val, index) => {
        					val.text = val.memberName;
        					val.value = val.memberId;
        					return val;
        				})
        				_this.users = List;
        			}
        	})
        },
    }
})