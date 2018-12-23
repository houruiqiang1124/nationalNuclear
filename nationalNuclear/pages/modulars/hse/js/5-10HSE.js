var _this = null;
new Vue({
    el: "#app",
    data: {
        showTab: true,
		recordNo:"",
		data:[]
    },
    mounted: function() {
		_this = this;
		function plusReady() {
			_this.recordNo = plus.webview.currentWebview().recordNo;
			_this.flowData();
		}
		if (window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
    },
    methods: {
        delay: function() {
            sne.navigateTo({
            	url: "./5-5HSE.html",
            	id: "5-5HSE.html"
            })
        },
		flowData:function(){
			plus.nativeUI.showWaiting();
			var param = {
				"recordNo": _this.recordNo
			}
			app.ajax({
				url: app.INTERFACE.hseCirculation,
				data: param,
				success: function(res) {
					if (res.object.resultCode == "0") {
						plus.nativeUI.closeWaiting();
						if (!res.beans) {
							return;
						}
                        let List = res.beans.map((val, index) => {
                            val.arriveTime.time = sne.getNowFormatDate(val.arriveTime.time);
                            val.actionName = val.actionName ? val.actionName : "";
                            return val;
                        })
                        _this.data = List;
					} else {
					}
				}
			})
		}
    }
})