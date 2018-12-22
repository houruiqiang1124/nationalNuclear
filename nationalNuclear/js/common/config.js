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
    }
}(mui,window.sne={}))