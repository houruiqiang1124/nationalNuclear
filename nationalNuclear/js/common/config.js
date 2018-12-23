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
    	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + hour + seperator2 + min;    
    	return currentdate;
    }
	f.getNowFormatDate = function getNowFormatDate(time) {
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
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + hour + seperator2 + min;    
        return currentdate;
	}
}(mui,window.sne={}))