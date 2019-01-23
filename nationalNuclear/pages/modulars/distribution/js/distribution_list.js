var _this = null;

new Vue({
    el: "#app",
    data: {
        list: [
            {
                title: '文件列表title',
                initator: '文件坐着',
                date: "2018-2-8",
                type: "人力资源部"
            },
            {
                title: '文件列表title',
                initator: '文件坐着',
                date: "2018-2-8",
                type: "人力资源部"
            },
            {
                title: '文件列表title',
                initator: '文件坐着',
                date: "2018-2-8",
                type: "人力资源部"
            }
        ],
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
           
        },
        // 下拉
        pulldownRefresh: function() {
           
        },
        getList: function() {
            
        },
        
        // 跳转详情
        goDetail: function() {
            sne.navigateTo({
                url: "./distribution_detail.html",
                id: "distribution_detail.html"
            })
        }
    }
})