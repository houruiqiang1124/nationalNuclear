var _this = null;
new Vue({
	el: "#app",
	data: {
        version: ""
	},
	mounted: function() {
		_this = this;
        
		function plusReady() {
			plus.runtime.getProperty(plus.runtime.appid, function(inf) {
				wgtVer = inf.version;
				_this.version = "v"+wgtVer;
			});
			plus.navigator.setStatusBarBackground("#0062CC");
			var loginUserInfo = JSON.parse(localStorage.getItem("loginUserInfo"));
			$("#myinfo").html(loginUserInfo.userName+"-"+loginUserInfo.department);
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
				/* var curr = plus.webview.currentWebview();//获取当前webview窗口
				var wvs = plus.webview.all();//获取所有webview窗口	
				for(var i=0,len=wvs.length;i<len;i++){		
					if (wvs[i].getURL()==curr.getURL()) {
						plus.webview.open('../../login/login.html');//打开登录窗口
						curr.close();//关闭当前窗口
					}else{
						plus.webview.close(wvs[i]);//关闭前面窗口
					}
				} */
			}, function(e){
				
			});
            plus.runtime.restart();
		},
		clearSession:function(){
			localStorage.clear();
			mui.toast("清除成功~");
		}
	}
})
