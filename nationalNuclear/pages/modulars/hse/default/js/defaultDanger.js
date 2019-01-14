var _this = null;

new Vue({
    el: "#app",
    data: {
        users: [],  
        checkedUser: {} // 选中人员信息
    },
    mounted: function() {
        _this = this;
        function plusReady(){
            _this.checkedUser = JSON.parse(localStorage.getItem("defaultDanger")) || {};
            console.log(localStorage.getItem("defaultDanger"))
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
            localStorage.setItem("defaultDanger",JSON.stringify(_this.checkedUser))
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
        //获取机组列表
        getCopyPerson: function() {
            var project = JSON.parse(localStorage.getItem("defaultProjNo"));
        	var param = {
        		"projNo": project && project.projectId || app.loginInfo.projNo,
        	}
        	app.ajax({
        		url: app.INTERFACE.getHazardTypeList,
        		data: param,
        		success: function(res) {
                    var defaultDanger =JSON.parse(localStorage.getItem("defaultDanger")); 
                    for(var i = 0; i < res.beans.length; i++) {
                        if(defaultDanger) {
                            if(res.beans[i].hazardTypeId == defaultDanger.hazardTypeId) {
                                res.beans[i].checked = true;
                            } else {
                                res.beans[i].checked = false;
                            }
                        } else {
                            res.beans[i].checked = false;
                        }
                    }
        			_this.users = res.beans; //抄送人
        		}
        	})
        }
    }
})