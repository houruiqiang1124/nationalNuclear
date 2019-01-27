var _this = null;

new Vue({
    el: "#app",
    data: {
        list: [],
        page: 0,
        searchType:"0",//0:没有搜索 1 搜索过
    },
    mounted: function() {
        _this = this;
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
        function plusReady(){
            console.log('init');
            _this.getList();
        }
        if (window.plus) {
            plusReady()
        } else{
            document.addEventListener('plusready',plusReady,false);
        }
    },
    methods: {
        // 上拉
        pullupRefresh: function() {
            _this.page++;
            _this.getList();
            // _this.getData();
        },
        // 下拉
        pulldownRefresh: function() {
           _this.list = [];
           _this.page=0;
            _this.getList();
           // _this.getData();
           mui('#refreshContainer').pullRefresh().refresh(true);
        },
        getList: function() {
            var types = {}; 
            types[plus.networkinfo.CONNECTION_UNKNOW] = false; 
            types[plus.networkinfo.CONNECTION_NONE] = false; 
            types[plus.networkinfo.CONNECTION_ETHERNET] = true; 
            types[plus.networkinfo.CONNECTION_WIFI] = true; 
            types[plus.networkinfo.CONNECTION_CELL2G] = true; 
            types[plus.networkinfo.CONNECTION_CELL3G] = true; 
            types[plus.networkinfo.CONNECTION_CELL4G] = true;
            var isNetwork = types[plus.networkinfo.getCurrentType()];
            if(!isNetwork) {
                return;
            }
//             var params = {};
//             params.url =app.INTERFACE.daiBan;
//             mui.mkey.get(params, function(data) {
//             	var jsonStr = data.getElementsByTagName("span")[0].textContent;
//             	var json = JSON.parse(jsonStr);
//             	console.log(jsonStr);
//                 _this.list = json.object.data;
//             });
            var param = {
            	"id": app.loginInfo.userId,
            	"logo": 0, //0-5
            	"start": _this.page,
            	"limit": 10
            }
            app.ajax({
            	url: app.INTERFACE.findToDo,
            	data: param,
            	success: function(res) {
            		if (res.object.resultCode == "0") {
            			plus.nativeUI.closeWaiting();
            			_this.page+=10;
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
            					item.draftDate.time = sne.getNowFormatDate(item.draftDate.time).substr(0,11);
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
            				_this.list = _this.list.concat(list);
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
        
        // 上拉数据，下拉数据
        getData: function() {
            var params = {};
            var pullParam = '?page=' + _this.page + '&type=&value=&systype=daiban&search=' + _this.searchType + '&targeter=&_dc=' + new Date().getTime();
            params.url = app.INTERFACE.daiBanPull + pullParam
            		console.log(JSON.stringify(params))
            		mui.mkey.get(params, function(data) {
            			var jsonStr = data.getElementsByTagName("span")[0].textContent;
            			console.log(jsonStr);
            			var json = JSON.parse(jsonStr);
            			if (json.object.resultCode == 0) {
            				if (!json.object.data) {
            					return;
            				}
            				if (json.object.data.length >= 1) {
            					_this.list = _this.list.concat(json.object.data);
            				}
            				if (json.object.data.length < 10) {
            					mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
            					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            				} else {
            					mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
            					mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            				}
            			}else{
            				mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
            				mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            			}
            		});
        },
        
        // 待办跳转详情
        goDetail: function(e) {
            if(e.stepId == "100") { // 代表待办退回
            	var param = {
            		recordNo: e.recordNo,
            		traceId: e.actionTraceId,
            		instanceId: e.instanceId,
            		dangerId: e.dangerId,
            		checkId: e.id,
                    data: e.data
            	};
            	sne.navigateTo({
            		url: "../modulars/hse/5-4HSE.html",
            		id: "5-4HSE.html",
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
                		tabCode:0
                	}
                })
            }
        }
    }
})