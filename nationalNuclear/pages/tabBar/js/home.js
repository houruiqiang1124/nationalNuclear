var _this = null;
new Vue({
	el: "#app",
	data: {
		daiBanList: [],
		noticeTitle: '',
		modular: [{
				title: "员工去向",
				url: "whereabouts",
				icon: "../../static/yuangongquxiang.png"
			},
			{
				title: "HES监督检查",
				url: "5-0HSE",
				icon: "../../static/hse.png"
			},
			{
				title: "用餐管理",
				url: "departementSearch",
				icon: "../../static/Have_meals.png"
			},
			{
				title: "绩效管理",
				url: "",
				icon: "../../static/jixiao.png"
			},
			{
				title: "公司要闻",
				url: "news",
				icon: "../../static/news.png"
			},
			{
				title: "车输管理",
				url: "",
				icon: "../../static/car.png"
			},
			{
				title: "公司公告",
				url: "noticeAnnouncement",
				icon: "../../static/Notice.png"
			},
			{
				title: "考勤管理",
				url: "",
				icon: "../../static/kaoqin.png"
			}
		]
	},
	mounted: function() {
		_this = this;
		function plusReady() {
			mui.init();
			// _this.companyNew();
			// _this.notice();
		}
		if (window.plus) { 
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
	},
	methods: {
        // 公司要闻
	 	companyNew: function() {
			var params = {};
			params.url = app.portalUrl + app.INTERFACE.companyNewUrl;
			mui.mkey.get(params, function(data) {
				var jsonStr = data.getElementsByTagName("span")[0].textContent;
				var json = JSON.parse(jsonStr);
				_this.daiBanList = json.object.data.slice(0, 3);
				detail = json.object.data[0].detailUrl;
				userid = json.object.userid;
			});
		},
        // 公告
		notice: function() {
			var params = {};
			params.url = app.INTERFACE.noticeUrl
			mui.mkey.get(params, function(data) {
				var jsonStr = data.getElementsByTagName("span")[0].textContent;
				var json = JSON.parse(jsonStr);
				if (json.object.resultCode == 0) {
					_this.noticeTitle = json.object.data[0].title
				}
				detail = json.object.data[0].detailUrl;
				userid = json.object.userid;
			});
		},
		search: function() {
			var param = {
				"id": "PJX",
				"logo": "5",
				"start": "0",
				"limit": "10"

			}
			app.ajax({
				url: app.INTERFACE.findToDo,
				data: param,
				success: function(res) {
					console.log(JSON.stringify(res))
				}
			})
		},
        // 跳转模块
        goPage(e) {
            sne.navigateTo({
                url: "../modulars/hse/" + e + ".html",
                id: e + ".html"
            })
        }
	}
})
