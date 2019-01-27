var _this = null;
var example1 = new Vue({
    el: "#app",
    data: {
        mailList: [],
        allList: [],
		list:[],
		searchVal:""
    },
    mounted: function() {
        console.log("通讯录")
		_this = this;
		function plusReady() {
			var header = document.querySelector('header.mui-bar');
			var list = document.getElementById('list');
			list.style.height = (window.screen.height - header.offsetHeight) + 'px';
			//create
			window.indexedList = new mui.IndexedList(list);
			 _this.getMail();
			 sne.quit();
		}
		if (window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
    },
    methods: {
        getMail: function() {
			plus.nativeUI.showWaiting("正在加载中，请稍等");
			var indexs = new Array();
			var arr = new Array(); //[{index:"a",citys:[{Nmae:"广州市"}]}];
            mui.ajax(app.mkeyUrl+'mailList.json',{
            	data:{
            		
            	},
            	dataType:'json',//服务器返回json格式数据
            	type:'get',//HTTP请求类型
            	timeout:50000,//超时时间设置为10秒；
            	success:function(data){
            		// console.log(JSON.stringify(data));
					var data = data.list;
					for(var i = 0; i < data.length; i++) {
						var shouZM = Pinyin.GetQP(data[i].EMPLOYEENAME).substr(0, 1).toUpperCase();//获取首字母
						if(indexs.indexOf(shouZM) < 0) {
							indexs.push(shouZM);
						}
					}
					indexs.sort();//索引排序
					for(var i = 0; i < indexs.length; i++) {
						var index = indexs[i];
						var mail = new Array();
						for(var j = 0; j < data.length; j++) {
							var shouZM = Pinyin.GetQP(data[j].EMPLOYEENAME).substr(0, 1).toUpperCase();
							if(index == shouZM) {
								mail.push(data[j]);
							}
						}
						arr.push({
							"index": index,
							"mail": mail
						});
					}
					_this.list = arr;
                    setTimeout(function() {
                        plus.nativeUI.closeWaiting();
                    }, 2000)
					
                    _this.mailList = data;
                    _this.allList = data;
            	},
            	error:function(xhr,type,errorThrown){
					plus.nativeUI.closeWaiting();
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
			_this.searchVal = $("#searchVal").val();
			if (event.keyCode == 13) { //如果按的是enter键 13是enter
				event.preventDefault(); //禁止默认事件（默认是换行） 
				console.log("===搜索内容==="+_this.searchVal);
				if(_this.searchVal == ""){
					plus.webview.currentWebview().reload();
				}else{
					plus.nativeUI.showWaiting();
					var indexs = new Array();
					var arr = new Array(); //[{index:"a",citys:[{Nmae:"广州市"}]}];
					var data = _this.allList;
					for(var i = 0; i < data.length; i++) {
						var shouZM = Pinyin.GetQP(data[i].EMPLOYEENAME).substr(0, 1).toUpperCase();//获取首字母
						if(indexs.indexOf(shouZM) < 0 && data[i].EMPLOYEENAME.indexOf(_this.searchVal) != -1) {
							indexs.push(shouZM);
						}
					}
					indexs.sort();//索引排序
					for(var i = 0; i < indexs.length; i++) {
						var index = indexs[i];
						var mail = new Array();
						for(var j = 0; j < data.length; j++) {
							var shouZM = Pinyin.GetQP(data[j].EMPLOYEENAME).substr(0, 1).toUpperCase();
							if(index == shouZM && data[j].EMPLOYEENAME.indexOf(_this.searchVal) != -1) {
								mail.push(data[j]);
							}
						}
							arr.push({
								"index": index,
								"mail": mail
							});
					}
					_this.list = arr;
					$("input[type=search]").blur();
                    setTimeout(function() {
                        plus.nativeUI.closeWaiting();
                    }, 2000)
					
// 					var mailList1 = _this.allList.slice(0);
// 					var arr = [];
// 					for(var i =0;i<mailList1.length;i++){
// 						if(mailList1[i].EMPLOYEENAME.indexOf(_this.searchVal) != -1){
// 						arr.push(mailList1[i]);
// 						}
// 					}
// 					_this.mailList= [null];
// 					_this.mailList = arr;
//                     $("input[type=search]").blur();
				}
			}
		}
    }
});
