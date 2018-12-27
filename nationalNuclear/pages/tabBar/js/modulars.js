var _this = null;
new Vue({
	el: "#app",
	data: {
		showDelImg: false,
		modulars: [{
				title: "用餐管理",
				url: "departementSearch",
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
		myModulars: [{
				title: "员工去向",
				url: "../modulars/company/4-1staff.html",
				icon: "../../static/yuangongquxiang.png",
				id: "4-1staff.html"
			},
			{
				title: "HES监督检查",
				url: "../modulars/hse/5-0HSE.html",
				icon: "../../static/hse.png",
				id: "5-0HSE.html"
			}
		]
	},
	mounted: function() {
		_this = this;

		function plusReady() {

		}
		if (window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
	},
	methods: {
		del: function(e) {
			console.log(e)
		},
		goPgae: function(e) {
			var userType = app.loginInfo.userType;
			if (userType == 0) { //0 临时用户  1内部用户
				if (id == "5-0HSE.html") {
					sne.navigateTo({
						url: e.url,
						id: e.id
					})
				} else {
					mui.toast("您无此权限！");
					return;
				}
			} else {
				sne.navigateTo({
					url: e.url,
					id: e.id
				})
			}
		},
        // 长按
        longtap: function(e) {
            console.log(11)
        }
	}
})
