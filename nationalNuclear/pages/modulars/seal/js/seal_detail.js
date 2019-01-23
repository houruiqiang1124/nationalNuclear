var _this = null;

new Vue({
    el: "#app",
    data: {
        
    },
    mounted: function() {
        _this = this;
        mui.init();
        function plusReady() {
            
        }
        if (window.plus) {
        	plusReady()
        } else {
        	document.addEventListener('plusready', plusReady, false);
        }
    },
    methods: {
    
    }
})