var _this = null;
new Vue({
    el: "#app",
    data: {
        voiceVal: "",
		delayDate: "",
		delayParam: {},
        delayNum: null
    },
    mounted: function() {
		_this = this;
		function plusReady() {
			_this.delayParam = plus.webview.currentWebview().params;
			_this.delayDate = sne.getNowFormatDate();
            _this.findDelayNum();
		}
		if (window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
    },
    methods: {
		// 日期选择
		checkDate: function() {
				var options = {"beginYear":2014,"endYear":2025};
				var picker = new mui.DtPicker(options);
				picker.show(function(rs) {
					_this.delayDate = rs.text;
				});
		},
		openVoice:function(){
			var options = {};
			options.engine = 'iFly';
			// alert("开始语音识别：");
			plus.speech.startRecognize(options, function(s) {
				_this.voiceVal += s.split("。")[0];
			}, function(e) {
				mui.toast("语音识别失败：" + e.message);
			});
		},
        // 延期申请
		delay:function() {
			var param = {
				"userId" : app.loginInfo.userId,
				"userName": app.loginInfo.userName,
				"actionTraceId": _this.delayParam.actionTraceId,
				"instanceId": _this.delayParam.instanceId,
				"dangerId": _this.delayParam.dangerId,
				"checkId": _this.delayParam.checkId,
				"reqCompleteDate": _this.delayParam.reqCompleteDate,
				"delayToApplyForDec": _this.voiceVal,
				"delayToApplyForDate": _this.delayDate,
                "delayNum": _this.delayNum
			}
			app.ajax({
				url: app.INTERFACE.findDelayToApplyFor,
				data: param,
				success: function(res) {
					console.log(res)
					if (res.object.resultCode == "0") {
						mui.toast("延期申请成功");
                        plus.webview.getWebviewById("5-10HSE.html").hide();
                        plus.webview.getWebviewById("5-10HSE.html").close();
                        mui.back();
					}else{
						mui.toast("延期申请失败");
					}
				}
			})
		},
        // 获取延期申请
        findDelayNum: function() {
            app.ajax({
                url: app.INTERFACE.findDelayNum,
                data: {
                   "dangerId" : _this.delayParam.dangerId,
                   "checkId" : _this.delayParam.checkId
                },
                success: function(res) {
                    if(res.object.resultCode == 0) {
                        _this.delayNum = res.object.num
                    }
                }
            })
        }
    }
})