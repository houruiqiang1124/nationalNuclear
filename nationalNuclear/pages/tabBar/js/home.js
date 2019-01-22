var _this = null;
new Vue({
	el: "#app",
	data: {
		daiBanList: [],
		noticeTitle: '',
        daiBanNum: "0",
        showUserType: true,
		modular: [
//             {
// 				title: "员工去向",
// 				url: "../modulars/company/4-1staff.html",
// 				icon: "../../static/yuangongquxiang.png",
// 				id:"4-1staff.html"
// 			},
			{
				title: "HSE监督检查",
				url: "../modulars/hse/5-0HSE.html",
				icon: "../../static/hse.png",
				id:"5-0HSE.html"
			}
		]
	},
	mounted: function() {
		_this = this; 
		function plusReady() {
			mui.init();
            _this.init();
			// _this.companyNew();
			// _this.notice();
            _this.toDoList();
            // _this.getBadge();
           
            window.addEventListener("change", function(e) {
                console.log(true)
                var modular = localStorage.getItem("myModulars");
                console.log(JSON.parse(modular))
                _this.modular =JSON.parse(modular);
            });
            // 刷新首页待办与角标
            window.addEventListener("refreshHome", function() {
                console.log("刷新首页...")
                _this.toDoList();
                // _this.getBadge();
            })
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
            console.log(JSON.parse(myModulars))
            if(myModulars) {
            	_this.modular = JSON.parse(myModulars)
            }
            if(app.loginInfo.userType == 0) {
                _this.showUserType = false;
            }
        },
        // 获取待办列表
		toDoList: function(){
            if(!sne.leaveLogin()) {
                return;
            }
            var params = {};
            params.url =app.INTERFACE.daiBan;
            mui.mkey.get(params, function(data) {
            	var jsonStr = data.getElementsByTagName("span")[0].textContent;
            	var json = JSON.parse(jsonStr);
            	console.log(jsonStr);
                _this.daiBanList = json.object.data.slice(0,3);
                _this.daiBanNum = json.object.pageTotal;
            });
// 			var param = {
// 				"id": app.loginInfo.userId,
// 				"logo": 0, //0-5
// 				"start": 0,
// 				"limit": "3"
// 			}
// 			app.ajax({
// 				url: app.INTERFACE.findToDo,
// 				data: param,
// 				success: function(res) {
// 					if (res.object.resultCode == "0") {
// 						plus.nativeUI.closeWaiting();
// 						_this.pageNo+=10;
// 						if (!res.beans) {
// 							return;
// 						}
// 						if (res.beans.length >= 1) {
// 							var list = res.beans.map((item, index) => {
// 								if (item.checkForm == '0') {
// 									item.checkForm = '日常检查'
// 								} else if (item.checkForm == '1') {
// 									item.checkForm = '专项检查'
// 								} else if (item.checkForm == '2') {
// 									item.checkForm = '综合检查'
// 								}
// 								if (item.stepId == "500" || item.stepId == "400") {
// 									item.recordNo = item.delayToApplyForNo;
// 								}
// 								item.draftDate.time = sne.getNowFormatDate(item.draftDate.time);
// 								item.checkDate.time = sne.getNowFormatDate(item.checkDate.time);
// 								if (item.approveDate) {
// 									item.approveDate.time = sne.getNowFormatDate(item.approveDate.time);
// 								} else {
// 									item.approveDate = {
// 										time: ""
// 									};
// 								}
// 								return item
// 							})
// 							if(list.length>3){
// 								_this.daiBanList = list.slice(0, 3);
// 							}else{
// 								_this.daiBanList = list;
// 							}
// 						}
// 					} else {
// 					}
// 				}
// 			})
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
        // 待办列表跳转更多
        openPage: function() {
            sne.navigateTo({
            	url: "./allDaiBan.html",
            	id: "allDaiBan.html"
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
        // 跳转设置
        goPage(url,id) {
            sne.navigateTo({
            	url: url,
            	id: id
            })
        },
        
        // 跳转模块
        goModular: function(url, id) {
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
                if(url == "") {
                    mui.toast("正在建设中");
                    return;
                } else {
                    sne.navigateTo({
                        url: url,
                        id: id
                    })
                }
            }
        },
        // 跳转模块更多
        goModulars: function() {
            sne.navigateTo({
            	url: "/pages/tabBar/modulars.html",
            	id: "modulars.html"
            })
        }
	}
})
