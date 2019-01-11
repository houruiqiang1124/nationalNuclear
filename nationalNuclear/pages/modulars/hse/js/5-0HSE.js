var _this = null;
new Vue({
	el: "#app",
	data: {
		userid: app.loginInfo.userId, // 当前登录人的id
		data: [],
		pageNo: 0,
		limit: "10",
		currentCode: "0",
        inspectParam: {}
	},
	mounted: function() {
		_this = this;
		function plusReady() {
			_this.getNumber();
			_this.requestData();
			window.addEventListener('refresh', function(e) {
				var num = e.detail.number;
				console.log(num)
				_this.changeList(num);
				_this.getNumber();
			})
		}
		if (window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}

		mui.init({
			pullRefresh: {
				container: '#refreshContainer',
				up: {
					callback: _this.pullupRefresh
				},
				down: {
					style: 'circle', //必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
					color: '#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
					height: '50px', //可选,默认50px.下拉刷新控件的高度,
					range: '100px', //可选 默认100px,控件可下拉拖拽的范围
					offset: '0px', //可选 默认0px,下拉刷新控件的起始位置
					auto: false, //可选,默认false.首次加载自动上拉刷新一次
					callback: _this.pulldownRefresh //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
				}
			}
		})
	},
	methods: {
		//角标
		getNumber: function() {
			var param = {
				"id": _this.userid
			}
			app.ajax({
				url: app.INTERFACE.hseBadge,
				data: param,
				success: function(res) {
					if (res.rtnCode == 0) {
						$("#toDoNum").html(res.object.toDoNum);
						$("#haveToDoNum").html(res.object.haveToDoNum);
						$("#circulationNum").html(res.object.circulationNum);
						$("#draftNum").html(res.object.draftNum);
						$("#waitingReadNum").html(res.object.waitingReadNum);
						$("#haveRead").html(res.object.haveRead);
					} else {}
				}
			})
		},
		//列表
		requestData: function() {
			plus.nativeUI.showWaiting();
			var param = {
				"id": _this.userid,
				"logo": _this.currentCode, //0-5
				"start": _this.pageNo,
				"limit": _this.limit
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
							_this.data = _this.data.concat(list);
						}
						if (res.beans.length < 10) {
							mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
							mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
						} else {
							mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
						}
					} else {
						mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
						mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
					}
				}
			})
		},
		//切换导航栏
		changeList: function(param) {
            _this.storageList();
            var index = 0;
            if(param == 0) {
                index = 0;
            } else if(param == 1) {
                index = 3;
            }else if(param == 2) {
                index = 2;
            } else if(param == 3) {
                index = 5;
            } else if(param == 4) {
                index = 1;
            } else if(param == 5) {
                index = 4;

            } 
			_this.data=[];
			_this.currentCode = param;
			_this.pageNo = 0;
			_this.requestData();
            for(var i = 0; i < 6; i++) {
                $(".nav-content").eq(i).removeClass("actives");
            }
            $(".nav-content").eq(index).addClass("actives")
            mui('#refreshContainer').pullRefresh().refresh(true);
            _this.getNumber();
		},
		// hse设置跳转
		hseSet: function() {
			console.log("true")
			sne.navigateTo({
				url: "./5-2HSE.html",
				id: "5-2HSE.html"
			})
		},
		// 新建检查单
		newCheck: function() {
            var  param = {
            	type: "new"
            }
			sne.navigateTo({
				url: "./5-3HSE.html",
				id: "5-3HSE.html",
                data:{
                	params: param
                }
			})
		},
		// 去详情
		goDetail: function(e) {
            if(e == "storage") {
                var  param = {
                    type: "storage",
                }
                sne.navigateTo({
                	url: "5-3HSE.html",
                	id: "5-3HSE.html",
                	data:{
                        params: param
                    }
                })
                return;
            };
            if(_this.currentCode == 3) {
                var  param = {
                    type: "list",
                    checkId: e.id,
                    dangerId: e.dangerId,
                    checkDate: e.checkDate.time,
                    checkPerson: e.checkPerson,
                    draftDate: e.draftDate.time,
                    recordNo: e.recordNo
                }
                sne.navigateTo({
                	url: "5-3HSE.html",
                	id: "5-3HSE.html",
                	data:{
                        params: param
                    }
                })
            } else if(_this.currentCode == 0) {
                if(e.stepId == "100") { // 代表待办退回
                	var param = {
                		recordNo: e.recordNo,
                		traceId: e.actionTraceId,
                		instanceId: e.instanceId,
                		dangerId: e.dangerId,
                		checkId: e.id
                	};
                	sne.navigateTo({
                		url: "5-4HSE.html",
                		id: "5-4HSE.html",
                		data: {
                			params: param
                		}
                	})
                } else {
                    sne.navigateTo({
                    	url: "5-10HSE.html",
                    	id: "5-10HSE.html",
                    	data: {
                    		params:e,
                    		tabCode:_this.currentCode
                    	}
                    })
                }
            } else if(_this.currentCode == 4) {
                // _this.isReaded(e.deliveryId);
                sne.navigateTo({
                	url: "5-10HSE.html",
                	id: "5-10HSE.html",
                	data: {
                		params:e,
                		tabCode:_this.currentCode
                	}
                })
            }  else {
                sne.navigateTo({
                    url: "5-10HSE.html",
                    id: "5-10HSE.html",
                    data: {
                        params:e,
                        tabCode:_this.currentCode
                    }
                })
            }
			
		},
        // 已阅
        isReaded: function(id) {
            app.ajax({
                url: app.INTERFACE.updateHaveRead,
                data: {
                    deliveryId: id
                },
                success: function(res) {
					var webview = plus.webview.getWebviewById("5-0HSE.html");
					var number=4;
					mui.fire(webview,'refresh',{
						number:number
					});
                    console.log("已阅");
                }
            })
        },
		// 上拉
		pullupRefresh: function() {
			_this.requestData();
		},
		//下拉
		pulldownRefresh: function() {
			_this.pageNo = 0;
            _this.data = [];
            _this.getNumber();
			_this.requestData();
            mui('#refreshContainer').pullRefresh().refresh(true);
		},
        // 草稿删除
        del: function(e, index) {
            app.ajax({
                url: app.INTERFACE.delCheckAndDanger,
                data: {
                    dangerId: e
                },
                success: function() {
                    _this.pulldownRefresh();
                }
            })
        },
        // 离线缓存拼接
        storageList: function() {
            var inspectParam = JSON.parse(localStorage.getItem("inspectParam"));
            console.log(JSON.stringify(inspectParam))
            if(inspectParam) {
                _this.inspectParam = inspectParam;
            }
        }
	}
})
