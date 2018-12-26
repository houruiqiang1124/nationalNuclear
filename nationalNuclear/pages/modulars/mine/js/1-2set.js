var _this = null;
new Vue({
	el: "#app",
	data: {

	},
	mounted: function() {
		_this = this;

		function plusReady() {
			plus.navigator.setStatusBarBackground("#0062CC")
		}
		if (window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
	},
	methods: {
		logout:function(){
			plus.sxfVpn.sxfVpnLogOut(function(e){
				var curr = plus.webview.currentWebview();//获取当前webview窗口
				var wvs = plus.webview.all();//获取所有webview窗口	
				for(var i=0,len=wvs.length;i<len;i++){		
					if (wvs[i].getURL()==curr.getURL()) {
						plus.webview.open('../../login/login.html');//打开登录窗口
						curr.close();//关闭当前窗口
					}else{
						plus.webview.close(wvs[i]);//关闭前面窗口
					}
				}
			}, function(e){
				
			});
		}
	}
})
