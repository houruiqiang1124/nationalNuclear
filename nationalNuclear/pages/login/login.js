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
        // _this.username = loginInfo.userId || "";
        // _this.password = loginInfo.userName || "";
		function plusReady() {
			mui.init();
			console.log("初始化plusReady"); 
			_this.username = localStorage.getItem("username") || "";
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
        },
		login: function(){
			if (this.username == '' || this.password == '') {
				mui.toast('用户名或密码不能为空！');
				return;
			} else {
				plus.nativeUI.showWaiting();
                // 临时跳过vpn登录
				_this.sxfVpnInit();
				// _this.tologin();
//                 var loginInfo = {
//                 	projNo: "SNG",  // 项目
//                     userId: this.username,
//                     userName: this.password,    // 登录人
//                 	draftUnit: "编制单位",    // 编制单位
//                 	draftDept: "编制部门",  // 编制部门
//                 	draftDate: "2018-12-23"   //编制日期
//                 }
// 				_this.remindAccount();
//                 localStorage.setItem("loginInfo",JSON.stringify(loginInfo));
//                 sne.navigateTo({url:"../tabBar/index.html",id:"index.html"}),
//                 plus.nativeUI.closeWaiting();
			}
		},
		//初始化vpn地址
		sxfVpnInit :function (){
			plus.sxfVpn.sxfVpnInit(1,app.vpnUrl,function(e){
				_this.sxfVpnLoginUser();
			}, function(e){
				plus.nativeUI.closeWaiting();
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
				// mui.alert(vpnMessage);
			});
		},
		tologin:function(){
			var code = "";
			var JSESSIONID = "";
            var md5Pwd = hex_md5(_this.password + '{1#2$3%4(5)6@7!poeeww$3%4(5)djjkkldss}') ;
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
					// "password": "213b3fc702ab8a643f67c2a27c556bb1",
                    "password": md5Pwd,
					"rdmCode": code,
					"loginType": "normal",
					"savePwdFlag": "0",
					"pwdText": "",
					"JSESSIONID": JSESSIONID
				};
				console.log(JSON.stringify(loginInfo))
				mui.mkey.login(loginInfo, function loginCallBack(data, msg) {
					if (data == true) {
						mui.ajax(app.mkeyUrl+"app_update.json",{
			            	data:{
			            		
			            	},
			            	dataType:'json',//服务器返回json格式数据
			            	type:'get',//HTTP请求类型
			            	timeout:10000,//超时时间设置为10秒；
			            	success:function(data){ 
			            		plus.runtime.getProperty(plus.runtime.appid, function(wgtinfo) {
			            			var app_ver = parseInt(wgtinfo.version.replace(/\./g, ''));
									if(parseInt(data.appversion.replace(/\./g, '')) > app_ver){
										downWgt(app.mkeyUrl+"H546DDF94.wgt");
									}else{
										var param ={
											"userId":_this.username,
										}
										app.ajax({
												url: app.INTERFACE.webServiceLogin,
												data: param,
												success: function(res) {													
				                                    _this.getUserInfo(res.userId, res.userType)													
												}
										})
									}
			            	});
			            	},
			            	error:function(xhr,type,errorThrown){
			            		var param ={
											"userId":_this.username,
										}
								app.ajax({
										url: app.INTERFACE.webServiceLogin,
										data: param,
										success: function(res) {													
		                                    _this.getUserInfo(res.userId, res.userType)													
										}
								})
			            	}
			            });
					} else {
						plus.nativeUI.closeWaiting();
						mui.toast("用户名或密码错误！");
					}
				}, false);
			})
		},
		//记住账号
		remindAccount(){
			if($(".mui-switch").hasClass("mui-active")){
				localStorage.setItem("username",_this.username);
			}else{
				localStorage.removeItem("username");
			}
		},
        // 获取信息
        getUserInfo: function(userId, userType) {
            app.ajax({
                url: app.INTERFACE.getHesUserInif,
                data: {
                    userName: userId
                },
                success: function(res) {
                    console.log(JSON.stringify(res));
                    _this.remindAccount();
                    var loginInfo = {
                    	// projNo: "SNG", 
                    	userId: res.object[0].userId,
                    	userName: res.object[0].userName,    // 登录人
                    	// draftUnit: "编制单位",    // 编制单位
                    	// draftDept: res.department,  // 编制部门
                    	userType: userType,
                        organizationId: res.object[0].organizationId,  // 单位id
                        draftUnit: res.object[0].organizationName, // 编制单位
                        
                        draftDept: res.object[0].departmentName,   // 编制部门
                        departmentId: res.object[0].departmentId,  //编制部门id
                        projectName: res.object[0].projectName,    // 项目名称
                        projNo: res.object[0].projectId,    // 项目id
                        name: res.object[0].name  // 真实姓名
                        
                    }
                    console.log('缓存' + JSON.stringify(loginInfo))
                    localStorage.setItem("loginInfo",JSON.stringify(loginInfo));
                    plus.nativeUI.closeWaiting();
                    sne.navigateTo({url:"../tabBar/index.html",id:"index.html"})
                }
            })
        }
	}
})
function downWgt(wgtUrl) {
	plus.nativeUI.showWaiting("正在更新文件...");
	plus.downloader.createDownload(wgtUrl, {
		filename: "_doc/update/"
	}, function(d, status) {
		if(status == 200) {
			//			alert("下载wgt成功：" + d.filename);
			console.log("下载wgt成功：" + d.filename);
			installWgt(d.filename); // 安装wgt包
		} else {
			console.log("下载wgt失败！");
			plus.nativeUI.toast("下载失败！");
			plus.nativeUI.closeWaiting();
		}
	}).start();
}
// 更新应用资源
function installWgt(path) {
	plus.runtime.install(path, {}, function() {
		console.log("安装wgt文件成功！");
		//plus.runtime.restart();
		plus.nativeUI.alert("应用资源更新完成,请退出重启应用！", function() {
			plus.nativeUI.closeWaiting();
			plus.runtime.restart();
		});
	}, function(e) {
		plus.nativeUI.closeWaiting();
		plus.nativeUI.toast("安装文件失败[" + e.code + "]：" + e.message);
	});
}

