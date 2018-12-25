var _this = null;

new Vue({
    el: "#app",
    data: {
        users: [{
            "memberId": "ZHANGDESHENG",
            "memberName": "张德生",
            "checked": false
        }, {
            "memberId": "ZHANGYONG8",
            "memberName": "张勇2",
            "checked": false
        }, {
            "memberId": "ZHANGQIMING",
            "memberName": "张奇明",
            "checked": false
        }, {
            "memberId": "ZHANGBAOLIANG",
            "memberName": "张保良",
            "checked": false
        }, {
            "memberId": "ZHANGSHAOWEI",
            "memberName": "张韶伟",
            "checked": false
        }, {
            "memberId": "ZHANGXINKE",
            "memberName": "张新科",
            "checked": false
        }, {
            "memberId": "ZHANGYAN1",
            "memberName": "张衍",
            "checked": false
        }, {
            "memberId": "ZHANGXIAOFEI1",
            "memberName": "张晓斐",
            "checked": false
        }, {
            "memberId": "ZHANGXIAOFEI",
            "memberName": "张晓斐",
            "checked": false
        }],  
        preaParam: {},  // 上个页面进来的参数
        checkedUser: {}, // 选中人员信息
        serchVal: ""
    },
    mounted: function() {
        _this = this;
        function plusReady(){
            _this.preaParam = plus.webview.currentWebview().params;
        }
        if (window.plus) {
            plusReady()
        } else{
            document.addEventListener('plusready',plusReady,false);
        }
    },
    methods: {
        // 确定
        ok: function() {
            if(_this.preaParam.pageType == "new") { // 从新建检查单进来
                var webview = plus.webview.getWebviewById("5-3HSE.html");
                mui.fire(webview,'custom', {
                    id: _this.checkedUser.memberId,
                    name: _this.checkedUser.memberName
                });
            } else if(_this.preaParam.pageType == "detail") {   // 从详情进来
                
            }
            mui.back();
        },
        // 选中人员
        checkedChange: function(e, index) {
            console.log(JSON.stringify(e))
            for(var i = 0; i < _this.users.length; i++) {
                _this.users[i].checked = false;
            }
            e.checked = true;
            _this.checkedUser = e;
        },
        //获取抄送人列表
        getCopyPerson: function() {
        	var param = {
        		"projNo": app.loginInfo.projNo,
        		// "userName": app.loginInfo.userName
        		"userName": ""
        	}
        	app.ajax({
        		url: app.INTERFACE.getCopyPerson,
        		data: param,
        		success: function(res) {
        			_this.users = res.beans; //抄送人
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
    }
})