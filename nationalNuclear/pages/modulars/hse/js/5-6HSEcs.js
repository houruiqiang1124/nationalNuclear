var _this = null;
new Vue({
    el: "#app",
    data: {
        users: [{
            "value": "ZHANGDESHENG",
            "label": "张德生",
        }, {
            "value": "ZHANGYONG8",
            "label": "张勇2"
        }, {
            "value": "ZHANGQIMING",
            "label": "张奇明"
        }, {
            "value": "ZHANGBAOLIANG",
            "label": "张保良"
        }, {
            "value": "ZHANGSHAOWEI",
            "label": "张韶伟"
        }, {
            "value": "ZHANGXINKE",
            "label": "张新科"
        }, {
            "value": "ZHANGYAN1",
            "label": "张衍"
        }, {
            "value": "ZHANGXIAOFEI1",
            "label": "张晓斐"
        }, {
            "value": "ZHANGXIAOFEI",
            "label": "张晓斐"
        }],
        forwardParam: {},
        checkedUser: {}    // 选中人员
    },
    mounted: function() {
        _this = this;
        function plusReady() {
            console.log(JSON.stringify(plus.webview.currentWebview().params))
        	_this.forwardParam = plus.webview.currentWebview().params;
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
            this.forwardParam.ownerUserId = this.checkedUser.label;
            this.forwardParam.ownerUserName = this.checkedUser.value;
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
        }
    }
})