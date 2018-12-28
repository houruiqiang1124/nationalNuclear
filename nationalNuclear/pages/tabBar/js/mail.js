var _this = null;
var example1 = new Vue({
    el: "#app",
    data: {
        mailList: [],
        allList: [],
		searchVal:""
    },
    mounted: function() {
		mui.ready(function() {
				var header = document.querySelector('header.mui-bar');
				var list = document.getElementById('list');
				list.style.height = (window.screen.height - header.offsetHeight) + 'px';
				//create
				window.indexedList = new mui.IndexedList(list);
			});
        _this = this;
        _this.getMail();
		sne.quit();
    },
    methods: {
        getMail: function() {
            mui.ajax(app.mkeyUrl+'mailList.json',{
            	data:{
            		
            	},
            	dataType:'json',//服务器返回json格式数据
            	type:'get',//HTTP请求类型
            	timeout:10000,//超时时间设置为10秒；
            	success:function(data){ 
            		console.log(JSON.stringify(data));
                    _this.mailList = data.list;
                    _this.allList = data.list;
            	},
            	error:function(xhr,type,errorThrown){
            		console.log(type)
            	}
            });
        },
        // 拨打电话
        phone: function(e) {
            plus.device.dial(e);
        },
        msg: function(e) {
            var msg = plus.messaging.createMessage(plus.messaging.TYPE_SMS);
            msg.to = [e];
            plus.messaging.sendMessage(msg);
        },
		searchName:function(event){
			if (event.keyCode == 13) { //如果按的是enter键 13是enter
				event.preventDefault(); //禁止默认事件（默认是换行） 
				console.log("===搜索内容==="+_this.searchVal);
				if(_this.searchVal == ""){
					plus.webview.currentWebview().reload();
				}else{
					var mailList1 = _this.allList.slice(0);
					var arr = [];
					for(var i =0;i<mailList1.length;i++){
						if(mailList1[i].EMPLOYEENAME.indexOf(_this.searchVal) != -1){
						arr.push(mailList1[i]);
						}
					}
					_this.mailList= [null];
					_this.mailList = arr;
                    $("input[type=search]").blur();
				}
			}
		}
    }
});
