var _this = null;
new Vue({
    el: "#app",
    data: {
        list: [],
        userid: "",
        searchVal: ""
    },
    mounted: function() {
        _this = this;
        function plusReady(){
            _this.getList();
        }
        if (window.plus) {
            plusReady()
        } else{
            document.addEventListener('plusready',plusReady,false);
        }
    },
    methods: {
        getList: function() {
            var params = {};
            params.url = app.portalUrl + app.INTERFACE.companyNewUrl;
            mui.mkey.get(params, function(data) {
            	var jsonStr = data.getElementsByTagName("span")[0].textContent;
            	var json = JSON.parse(jsonStr);
            	_this.list = json.object.data;
            	_this.userid = json.object.userid;
            });
        },
        // 去详情
        goDetail: function(e) {
            var param = {
                userid: _this.userid,
                detailUrl: e.detailUrl
            }
            sne.navigateTo({
                url: "./3-2Detail.html",
                id: "3-2Detail",
                data: {
                    param: param
                }
            })
        },
        // 搜索
        search: function() {
            var params = {};
            var searchValue = _this.searchVal;
            var page = 1;
            var searchType = 1;
            params.url = app.companyNewUrlSearch + 'type=1&value=' +
					encodeURI(encodeURI(searchValue)) + '&systype=00&page=' + page + '&search=' + searchType + '&_dc=' + new Date().getTime();
            mui.mkey.get(params, function(data) {
                var jsonStr = data.getElementsByTagName("span")[0].textContent;
                var json = JSON.parse(jsonStr);
                _this.list = json.object.data;
            });
        }
    }
})