var _this = null;
new Vue({
	el: "#app",
	data: {
		daiBanList: [],
		noticeTitle: '',
		modular: [{
				title: "员工去向",
				url: "../modulars/company/4-1staff.html",
				icon: "../../static/yuangongquxiang.png",
				id:"4-1staff.html"
			},
			{
				title: "HES监督检查",
				url: "../modulars/hse/5-0HSE.html",
				icon: "../../static/hse.png",
				id:"5-0HSE.html"
			},
			{
				title: "用餐管理",
				url: "departementSearch",
				icon: "../../static/Have_meals.png",
				id:""
			},
			{
				title: "绩效管理",
				url: "",
				icon: "../../static/jixiao.png",
				id:""
			},
			{
				title: "公司要闻",
				url: "../modulars/news/3-1.html",
				icon: "../../static/news.png",
				id:"3-1.html"
			},
			{
				title: "车输管理",
				url: "",
				icon: "../../static/car.png",
				id:""
			},
			{
				title: "公司公告",
				url: "../modulars/company/2-1.html",
				icon: "../../static/Notice.png",
				id:"2-1.html"
			},
			{
				title: "考勤管理",
				url: "",
				icon: "../../static/kaoqin.png",
				id:""
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
		toDoList: function(){
			var param = {
				"id": app.loginInfo.userId,
				"logo": 0, //0-5
				"start": 0,
				"limit": "10"
			}
			app.ajax({
				url: app.INTERFACE.findToDo,
				data: param,
				success: function(res) {
					if (res.object.resultCode == "0") {
						plus.nativeUI.closeWaiting();
						_this.pageNo+=10;
						if (!res.beans) {
							return;
						}
						if (res.beans.length >= 1) {
							var list = res.beans.map((item, index) => {
								if (item.checkForm == '0') {
									item.checkForm = '日常检查'
								} else if (item.checkForm == '1') {
									item.checkForm = '专项检查'
								} else if (item.checkForm == '2') {
									item.checkForm = '综合检查'
								}
								if (item.stepId == "500" || item.stepId == "400") {
									item.recordNo = item.delayToApplyForNo;
								}
								item.draftDate.time = sne.getNowFormatDate(item.draftDate.time);
								item.checkDate.time = sne.getNowFormatDate(item.checkDate.time);
								if (item.approveDate) {
									item.approveDate.time = sne.getNowFormatDate(item.approveDate.time);
								} else {
									item.approveDate = {
										time: ""
									};
								}
								return item
							})
							if(list.length>3){
								_this.data = list.slice(0, 3);
							}else{
								_this.data = list;
							}
						}
					} else {
					}
				}
			})
		},
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
        goPage(url,id) {
            sne.navigateTo({
                url: url,
                id: id
            })
        }
	}
})
