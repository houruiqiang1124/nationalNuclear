var _this = null;
new Vue({
    el: "#app",
    data: {
        mailList: []
    },
    mounted: function() {
        _this = this;
        function plusReady() {
            
        	_this.getMail();
        }
        if (window.plus) {
        	plusReady()
        } else {
        	document.addEventListener('plusready', plusReady, false);
        }
    },
    methods: {
        getMail: function() {
            mui.ajax('./js/mailList.json',{
            	data:{
            		
            	},
            	dataType:'json',//服务器返回json格式数据
            	type:'get',//HTTP请求类型
            	timeout:10000,//超时时间设置为10秒；
            	success:function(data){ 
            		console.log(JSON.stringify(data));
                    _this.mailList = data.list;
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
        }
    }
})