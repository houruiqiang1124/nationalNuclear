var _this = null;
new Vue({
	el: "#app",
	data: {
		showDelImg: false,
		modulars: [{
				title: "用餐管理",
				url: "",
				icon: "../../static/Have_meals.png",
				id: ""
			},
			{
				title: "绩效管理",
				url: "",
				icon: "../../static/jixiao.png",
				id: ""
			},
			// 			{
			// 				title: "公司要闻",
			// 				url: "../modulars/news/3-1.html",
			// 				icon: "../../static/news.png",
			// 				id:"3-1.html"
			// 			},
			{
				title: "车输管理",
				url: "",
				icon: "../../static/car.png",
				id: ""
			},
			// 			{
			// 				title: "公司公告",
			// 				url: "../modulars/company/2-1.html",
			// 				icon: "../../static/Notice.png",
			// 				id:"2-1.html"
			// 			},
			{
				title: "考勤管理",
				url: "",
				icon: "../../static/kaoqin.png",
				id: ""
			}
		],
		myModulars: [
            {
				title: "员工去向",
				url: "../modulars/company/4-1staff.html",
				icon: "../../static/yuangongquxiang.png",
				id: "4-1staff.html"
			},
			{
				title: "HSE监督检查",
				url: "../modulars/hse/5-0HSE.html",
				icon: "../../static/hse.png",
				id: "5-0HSE.html"
			}
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
            _this.modulars.push(arr[0]);
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
            console.log(e)
            var arr = _this.modulars.splice(e, 1);
            _this.myModulars.push(arr[0]);
            _this.change();
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
