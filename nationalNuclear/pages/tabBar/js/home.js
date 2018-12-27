var _this = null;
new Vue({
	el: "#app",
	data: {
		daiBanList: [],
		noticeTitle: '',
        daiBanNum: "0",
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
            	title: "更多",
            	url: "./modulars.html",
            	icon: "../../static/addPng.png",
            	id:"modulars.html"
            }
		]
	},
	mounted: function() {
		_this = this; 
		function plusReady() {
			mui.init();
			// _this.companyNew();
			// _this.notice();
            _this.toDoList();
            _this.getBadge();
		}
		if (window.plus) { 
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
	},
	methods: {
        // 获取待办列表
		toDoList: function(){
			var param = {
				"id": app.loginInfo.userId,
				"logo": 0, //0-5
				"start": 0,
				"limit": "3"
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
								_this.daiBanList = list.slice(0, 3);
							}else{
								_this.daiBanList = list;
							}
						}
					} else {
					}
				}
			})
		},
        // 获取待办角标
        getBadge: function() {
            app.ajax({
               	url: app.INTERFACE.hseBadge,
               	data: {
                    "id": app.loginInfo.userId
                },
               	success: function(res) {
               		if (res.rtnCode == 0) {
               			_this.daiBanNum = res.object.toDoNum;
               		} else {}
               	}
            })
        },
        // 跳转更多
        openPage: function() {
            sne.navigateTo({
            	url: "../modulars/hse/5-0HSE.html",
            	id: "5-0HSE.html"
            })
        },
        // 待办跳转详情
        goDetail: function(e) {
            if(e.stepId == "100") { // 代表待办退回
            	var param = {
            		recordNo: e.recordNo,
            		traceId: e.actionTraceId,
            		instanceId: e.instanceId,
            		dangerId: e.dangerId,
            		checkId: e.id
            	};
            	sne.navigateTo({
            		url: "../modulars/hse/5-10HSE.html",
            		id: "5-10HSE.html",
            		data: {
            			params: param
            		}
            	})
            } else {
            	sne.navigateTo({
            		url: "../modulars/hse/5-10HSE.html",
            		id: "5-10HSE.html",
            		data: {
            			params:e,
            			tabCode: 0
            		}
            	})
            }
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
            var userType = app.loginInfo.userType;
            if(userType == 0) { //0 临时用户  1内部用户
                if(id == "5-0HSE.html") {
                    sne.navigateTo({
                    	url: url,
                    	id: id
                    })
                } else {
                    mui.toast("您无此权限！");
                    return;
                }
            } else {
                sne.navigateTo({
                	url: url,
                	id: id
                })
            }
            
        }
	}
})
