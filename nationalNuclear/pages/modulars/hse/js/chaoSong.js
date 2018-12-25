var _this = null;

new Vue({
    el: "#app",
    data: {
        users: [    // 人员列表
            {
                "value": "ZHANGDESHENG",
                "text": "张德生",
                "checked": false
            }, {
                "value": "ZHANGYONG8",
                "text": "张勇2",
                "checked": false
            }, {
                "value": "ZHANGQIMING",
                "text": "张奇明",
                "checked": false
            }, {
                "value": "ZHANGBAOLIANG",
                "text": "张保良",
                "checked": false
            }, {
                "value": "ZHANGSHAOWEI",
                "text": "张韶伟",
                "checked": false
            }, {
                "value": "ZHANGXINKE", 
                "text": "张新科",
                "checked": false
            }, {
                "value": "ZHANGYAN1",
                "text": "张衍",
                "checked": false
            }, {
                "value": "ZHANGXIAOFEI1",
                "text": "张晓斐",
                "checked": false
            }, {
                "value": "ZHANGXIAOFEI",
                "text": "张晓斐",
                "checked": false
            }
        ],  
        preaParam: {},  // 上个页面进来的参数
        checkedUser: {} // 选中人员信息
    },
    mounted: function() {
        _this = this;
        function plusReady(){
            
        }
        if (window.plus) {
            plusReady()
        } else{
            document.addEventListener('plusready',plusReady,false);
        }
    },
    methods: {
        // 确定
        ok: function() {
            
        },
        // 选中人员
        checkedChange: function(e, index) {
            for(var i = 0; i < _this.users.length; i++) {
                _this.users[i].checked = false;
            }
            e.checked = true;
            _this.checkedUser = e;
            console.log(_this.checkedUser)
        }
    }
})