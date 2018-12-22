var _this = null;
new Vue({
    el: "#app",
    data: {
			daiBanList:[],
        modular: [{
        		title: "员工去向",
        		url: "whereabouts",
        		icon: "../../static/yuangongquxiang.png"
        	},
        	{
        		title: "HES监督检查",
        		url: "HSE",
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
		mounted:function(){
			_this = this;
			function plusReady() {
				mui.init();
				_this.companyNew()
				console.log("初始化plusReady");
			}
			if (window.plus) {
				plusReady()
			} else {
				document.addEventListener('plusready', plusReady, false);
			}
			
		},
    methods:{
       companyNew:function(){
		   var params = {};
				params.url = app.portalUrl+app.INTERFACE.companyNewUrl;
				mui.mkey.get(params, function(data) {
					var jsonStr = data.getElementsByTagName("span")[0].textContent;
					console.log(jsonStr);
					var json = JSON.parse(jsonStr);
					_this.daiBanList= json.object.data.slice(0,3);
					console.log(JSON.stringify(_this.daiBanList))
					detail = json.object.data[0].detailUrl;
					userid = json.object.userid;
					console.log(detail)
				});
	   } 
    }
})