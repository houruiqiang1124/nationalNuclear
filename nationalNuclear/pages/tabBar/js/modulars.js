var _this = null;
new Vue({
	el: "#app",
	data: {
		showDelImg: false,
		modulars: [
			{
				title: "绩效查询",
				// url: "../modulars/achievements/achievementsList.html",
                url:"",
				icon: "../../static/jixiao.png",
				id: "achievementsList.html",
                type: "enterprise"  // 企业应用
			},
            {
            	title: "员工去向",
            	url: "../modulars/company/4-1staff.html",
            	icon: "../../static/yuangongquxiang.png",
            	id: "4-1staff.html",
                type: "enterprise"
            },
//             {
//             	title: "印章审批",
//             	url: "../modulars/seal/seal_list.html",
//             	icon: "../../static/yingZang.png",
//             	id: "seal_list.html",
//                 type: "enterprise"
//             },
//             {
//             	title: "收发文审批",
//             	url: "",
//             	icon: "../../static/yuangongquxiang.png",
//             	id: "4-1staff.html",
//                 type: "enterprise"
//             },
//             {
//             	title: "文件编&文件分发审批",
//             	url: "../modulars/distribution/distribution_list.html",
//             	icon: "../../static/fenFa.png",
//             	id: "4-1staff.html",
//                 type: "enterprise"
//             },
            {
            	title: "HSE监督检查",
            	url: "../modulars/hse/5-0HSE.html",
            	icon: "../../static/hse.png",
            	id: "5-0HSE.html",
                type: "engineering" // 工程应用
            }
		],
		myModulars: [
            
// 			{
// 				title: "HSE监督检查",
// 				url: "../modulars/hse/5-0HSE.html",
// 				icon: "../../static/hse.png",
// 				id: "5-0HSE.html"
// 			}
		]
	},
	mounted: function() {
		_this = this;

		function plusReady() {
            mui.init({
                gestureConfig:{
                    longtap: true, //默认为false
              }
            })
            _this.init();
		}
		if (window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
	},
	methods: {
        init: function() {
            var myModulars = localStorage.getItem("myModulars");
            var modulars = localStorage.getItem("modulars");
            if(myModulars) {
                _this.myModulars = JSON.parse(myModulars)
            }
            if(modulars) {
            	_this.modulars = JSON.parse(modulars)
            }
        },
        // 我的应用删除
		del: function(e) {
            var arr = _this.myModulars.splice(e, 1);
            // _this.modulars.push(arr[0]);
            _this.change();
		},
        // 跳转模块
		goPgae: function(e) {
			var userType = app.loginInfo.userType;
			if (userType == 0) { //0 临时用户  1内部用户
				if (e.id == "5-0HSE.html") {
					sne.navigateTo({
						url: e.url,
						id: e.id
					})
				} else {
					mui.toast("您无此权限！");
					return;
				}
			} else {
                if(e.url == "") {
                    mui.toast("正在建设中");
                    return;
                } else {
                    sne.navigateTo({
                    	url: e.url,
                    	id: e.id
                    })
                }
				
			}
		},
        clearLoop: function(e) {
            for(var i = 0; i < _this.myModulars.length; i++) {
                if(e.id == _this.myModulars[i].id) {
                    mui.toast("不能重复添加");
                    return;
                }
            }
            _this.myModulars.push(e);
            _this.change();
            // var arr = _this.modulars.splice(e, 1);
        },
        // 更新首页
        change: function() {
            localStorage.setItem("myModulars",JSON.stringify(_this.myModulars));
            localStorage.setItem("modulars", JSON.stringify(_this.modulars));
            var webView = plus.webview.getWebviewById("home.html");
            mui.fire(webView,"change",{})
        }
	}
})
