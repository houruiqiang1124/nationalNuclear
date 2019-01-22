var _this = null;

new Vue({
    el: "#app",
    data: {
        list: [],
        page: 1,
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
            _this.getData();
        },
        // 下拉
        pulldownRefresh: function() {
           _this.list = [];
           _this.page=1;
           _this.getData();
           mui('#refreshContainer').pullRefresh().refresh(true);
        },
        getList: function() {
            if(!sne.leaveLogin()) {
                return;
            }
            var params = {};
            params.url =app.INTERFACE.daiBan;
            mui.mkey.get(params, function(data) {
            	var jsonStr = data.getElementsByTagName("span")[0].textContent;
            	var json = JSON.parse(jsonStr);
            	console.log(jsonStr);
                _this.list = json.object.data;
            });
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
        }
    }
})