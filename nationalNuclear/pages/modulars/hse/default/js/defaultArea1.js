var _this = null;

new Vue({
    el: "#app",
    data: {
        users: [],  
        checkedUser: {}, // 选中人员信息
    },
    mounted: function() {
        _this = this;
        function plusReady(){
             _this.checkedUser = JSON.parse(localStorage.getItem("defaultArea")) || {};
            _this.getCopyPerson();
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
            localStorage.setItem("defaultArea",JSON.stringify(_this.checkedUser))
            mui.back();
        },
        // 选中人员
        checkedChange: function(e, index) {
            console.log(JSON.stringify(e))
            for(var i = 0; i < _this.users.length; i++) {
                _this.users[i].checked = false;
            }
            e.checked = true;
            _this.checkedUser = e;
        },
        //获取默认区域列表
        getCopyPerson: function() {
        	var useaArea = JSON.parse(localStorage.getItem("useaArea"));
            console.log(JSON.stringify(useaArea))
            if(useaArea) {
                _this.users = useaArea;
                _this.checkStor(useaArea)
            }
        },
        // 选中缓存人员
        checkStor: function(obj) {
            var user = JSON.parse(localStorage.getItem("defaultArea"));
            console.log(JSON.stringify(user))
            if(user) {
                for(key in obj) {
                    if(obj[key].zonoId == user.zonoId) {
                        obj[key].checked = true;
                    }
                }
            }
        }
    }
})