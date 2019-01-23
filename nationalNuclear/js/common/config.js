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
	f.xml2json = function(xml){
		//将xml字符串转为json  
		var xotree = new XML.ObjTree();  
		var json = xotree.parseXML(xml);  
		//将json对象转为格式化的字符串  
		var dumper = new JKL.Dumper();  
		var jsonText = dumper.dump(json);
		return jsonText;
	}
	f.json2xml = function(json){
		var xotree = new XML.ObjTree();  
		//将json字符串转为json对象后转为xml字符串
		var jsonText = JSON.stringify(json)
		var json = eval("(" + jsonText + ")");  
		var xml = xotree.writeXML(json);  
		//使用jkl-dumper.js中的formatXml方法将xml字符串格式化  
		var xmlText = formatXml(xml); 
		 return xmlText;
	}
	f.xmlAjax = function(param,success,error){
		plus.nativeUI.showWaiting();
		console.log('【参数】' + JSON.stringify(param));
		mui.ajax(app.edrmsUrl,{
			data: {
				xml:param
			},
			// dataType:'json',//服务器返回json格式数据
			type:'POST',//HTTP请求类型
			timeout:50000,//超时时间设置为10秒；
			success:function(res){
		        console.log('【请求地址】'+ url)
		        console.log("【请求成功】" + res)
		        plus.nativeUI.closeWaiting();
				success(res);
			},
			error:function(xhr,type,errorThrown){
		        plus.nativeUI.closeWaiting();
		        console.error('【请求错误地址】'+url)
				console.error('【请求错误】' + type)
				error(xhr,type,errorThrown)
			}
		});
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