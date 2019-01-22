var _this = null;
new Vue({
	el: "#app",
	data: {
		userid:"",
		data:[],
		page:"1",
		searchType:"0",//0:没有搜索 1 搜索过
		searchValue:"",
        tabCode: ""
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
		});
		function plusReady() {
			_this.requestData();
		}
		if (window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
	},
	methods: {
        // 切换导航
        navChange: function(e) {    // 0 公司公告  1公司要闻
            console.log(e);
            _this.data=[];
            _this.page = 1;
            if(e == _this.tabCode) {
                return;
            }
            _this.tabCode = e;
            _this.requestData();
            mui('#refreshContainer').pullRefresh().refresh(true);
        },
		requestData:function (){
            if(!sne.leaveLogin()) {
                return;
            }
			var params = {};
            if(_this.tabCode == 0) {
                params.url = app.INTERFACE.noticeUrl
            } else {
                params.url = app.INTERFACE.companyNewUrl
            }
            console.log(JSON.stringify(params) )
			mui.mkey.get(params, function(data) {
				var jsonStr = data.getElementsByTagName("span")[0].textContent;
				var json = JSON.parse(jsonStr);
				if (json.object.resultCode == 0) {
					if (!json.object.data) {
						return;
					}
					if (json.object.data.length >= 1) {
						_this.userid=json.object.userid;
						_this.data = json.object.data;
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
		searchData: function(){
            if(!sne.leaveLogin()) {
                return;
            }
			var params = {};
			params.url = app.INTERFACE.noticeSearchUrl+'?type=1&value=' + encodeURI(encodeURI(_this.searchValue)) + '&systype=5&page=' + _this.page + '&search=' + _this.searchType + '&_dc=' + new Date().getTime();
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
								_this.data = _this.data.concat(json.object.data);
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
		//点击搜索
		searchBtn: function(){
			if(_this.searchValue == ""){
				_this.searchType="0";//0:没有搜索 1 搜索过
			}else{
				_this.searchType="1";//0:没有搜索 1 搜索过
			}
			_this.page="1";
			_this.data=[];
			_this.searchData();
		},
		//重置
		retBtn:function(){
			_this.searchValue = "";
			// _this.data=[];
		},
		//下拉
		pulldownRefresh: function () {
			_this.data=[];
			_this.page="1";
			_this.searchData();
			mui('#refreshContainer').pullRefresh().refresh(true);
		},
		//上拉
		pullupRefresh: function () {
			_this.page++;
			_this.searchData();
		},
        toDetail: function(data){
			var detailUrl = data.detailUrl;
			sne.navigateTo({
                 url: "../modulars/news/3-2Detail.html",
                 id: "3-2Detail.html",
                 data: {                    
                 	detailUrl: detailUrl,
                 	userid: _this.userid
               	}
            })
		}
	}
})