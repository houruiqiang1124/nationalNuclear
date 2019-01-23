(function(m, f) {
    /**
     * @param {Object} id页面id url路径 data参数
     */
    f.navigateTo = function(options) {
        m.openWindow({
        	id: options.id,
        	url: options.url,
        	show: {
        		aniShow: 'pop-in',
        		duration: 250
        	},
        	extras: options.data || {},
        	waiting: {
        		autoShow: false, //自动显示等待框，默认为true
        	}
        });
    };
    
    /**
    * 可以获取当前时间，并且可以时间戳转换标准时间
    * @param {String} time 时间戳
    */
    f.getNowFormatDate = function(time) {
    	var date = time ? new Date(time) : new Date();    
    	var seperator1 = "-";    
    	var seperator2 = ":";    
    	var month = date.getMonth() + 1;    
    	var strDate = date.getDate();    
    	var hour = date.getHours();
    	var min = date.getMinutes();
    	var second = date.getSeconds();
    	if (month >= 1 && month <= 9) {        
    		month = "0" + month;    
    	}    
    	if (strDate >= 0 && strDate <= 9) {        
    		strDate = "0" + strDate;    
    	}    
    	if (hour >= 0 && hour <= 9) {
    		hour = "0" + hour; 
    	}
    	if (min >= 0 && min <= 9) {
    		min = "0" + min; 
    	}
    	if (second >= 0 && second <= 9) {
    		second = "0" + second; 
    	}
    	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + hour + seperator2 + min + seperator2 + second;    
    	return currentdate;
    }
	f.getNowFormatDate2 = function (time) {
            var dateee = new Date(time).toJSON();
			var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'')  
         return date;
	}
    
    
	f.quit = function (){
		//监听返回键，退出APP
		var first = null;  
		mui.back=function(){
		if(!first){  
				first = new Date().getTime();  
				mui.toast('再按一次退出应用');  
				setTimeout(function(){  
					first = null;  
				},2000);  
			} else {  
				if(new Date().getTime() - first < 2000){  
					plus.runtime.quit();  
				}  
			}  
		};
	};
    
    f.leaveLogin = function() {
        var types = {}; 
        types[plus.networkinfo.CONNECTION_UNKNOW] = false; 
        types[plus.networkinfo.CONNECTION_NONE] = false; 
        types[plus.networkinfo.CONNECTION_ETHERNET] = true; 
        types[plus.networkinfo.CONNECTION_WIFI] = true; 
        types[plus.networkinfo.CONNECTION_CELL2G] = true; 
        types[plus.networkinfo.CONNECTION_CELL3G] = true; 
        types[plus.networkinfo.CONNECTION_CELL4G] = true;
        var isNetwork = types[plus.networkinfo.getCurrentType()];
        return isNetwork;
    };
    // 刷新首页
    f.refreshHome = function() {
        var webView = plus.webview.getWebviewById("home.html");
        mui.fire(webView, "refreshHome",{})
    }
    
    // 获取人员信息
    f.getPhone = function(str, fn) {
        app.ajax({
        		url: app.INTERFACE.webServiceLogin,
        		data: {
                    "userId": str
                },
        		success: function(res) {
                   fn(res)
        		},
                error: function() {
                    // 、mui.toast("账号或密码错误");
                }
        })
    }
}(mui,window.sne={}))