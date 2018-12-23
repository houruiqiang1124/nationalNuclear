var _this = null;
var vm = new Vue({
	el: "#app",
	data: {
		eyeImg: "../../static/browse.png",
        showEye: false,
        typePwd: 'password' ,
		username:"",
		password:""
	},
	mounted: function() {
		_this = this;
        var loginInfo = JSON.parse(localStorage.getItem("loginInfo")) ;
        _this.username = loginInfo.userId || "";
        _this.password = loginInfo.userName || "";
		function plusReady() {
			mui.init();
			console.log("初始化plusReady"); 
		}
		if (window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
	},
	methods: {
        // 切换密码框
		eye: function() {
            this.showEye = !this.showEye
            if(this.showEye) {
                this.eyeImg = "../../static/2-1-browse.png",
                this.typePwd = "text";
            } else {
                this.eyeImg = "../../static/browse.png";
                this.typePwd = 'password';
            }
            console.log(true)
        },
		login: function(){
			
			if (this.username == '' || this.password == '') {
				mui.alert('用户名或密码不能为空！');
				return;
			} else {
				plus.nativeUI.showWaiting();
                // 临时跳过vpn登录
				// _this.sxfVpnInit();
				// _this.tologin();
                var loginInfo = {
                	projNo: "项目2018-12-23测试",  // 项目
                    userId: this.username,
                    userName: this.password,    // 登录人
                	draftUnit: "编制单位",    // 编制单位
                	draftDept: "编制部门",  // 编制部门
                	draftDate: "2018-12-23"   //编制日期
                }
                localStorage.setItem("loginInfo",JSON.stringify(loginInfo));
                sne.navigateTo({url:"../tabBar/index.html",id:"index.html"}),
                plus.nativeUI.closeWaiting();
			}
		},
		//初始化vpn地址
		sxfVpnInit :function (){
			plus.sxfVpn.sxfVpnInit(1,app.vpnUrl,function(e){
				_this.sxfVpnLoginUser();
			}, function(e){
				plus.nativeUI.closeWaiting();
				alert("初始化失败"+e);
			});
		},
		//vpn登录
		sxfVpnLoginUser:function (){
			plus.sxfVpn.sxfVpnLoginUser(app.vpnUsername,app.vpnPassword,"",function(e){
				_this.tologin();
			}, function(e){
				var vpnMessage = "";
				plus.nativeUI.closeWaiting();
				if(plus.os.name == "iOS") {
					vpnMessage = e.message.split("code")[0].substr(0,e.message.split("code")[0].length-1);
				}else{
					vpnMessage = e;
				}
				mui.alert(vpnMessage);
			});
		},
		tologin:function(){
			var code = "";
			var JSESSIONID = "";
			mui.mkey.get({
				url: app.portalUrl+app.INTERFACE.checkCodeUrl +
					new Date().getTime(),
				"nologin": true
			}, function(data) {
				var jsonStr = data.getElementsByTagName("span")[0].textContent;
				var json = JSON.parse(jsonStr);
				code = eval('(' + json.data + ')').code;
				JSESSIONID = json.JSESSIONID;
				var loginInfo = {
					"username": _this.username,
					"password": "213b3fc702ab8a643f67c2a27c556bb1",
					"rdmCode": code,
					"loginType": "normal",
					"savePwdFlag": "0",
					"pwdText": "",
					"JSESSIONID": JSESSIONID
				};
				console.log(JSON.stringify(loginInfo))
				mui.mkey.login(loginInfo, function loginCallBack(data, msg) {
					if (data == true) {
						plus.nativeUI.closeWaiting();
						sne.navigateTo({url:"../tabBar/index.html",id:"index.html"})
					} else {
						plus.nativeUI.closeWaiting();
						mui.alert("用户名或密码错误！");
					}
				}, false);
			})
		}
	}
})

