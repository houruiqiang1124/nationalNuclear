var _this = null;

new Vue({
    el: "#app",
    data: {
        users: [],  
        checkedUser: {}, // 选中人员信息
        serchVal: ""
    },
    mounted: function() {
        _this = this;
        function plusReady(){
            _this.checkedUser = JSON.parse(localStorage.getItem("defaultProjNo")) || {};
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
            localStorage.setItem("defaultProjNo",JSON.stringify(_this.checkedUser))
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
        //获取项目列表
        getCopyPerson: function() {
        	var param = {
                userName: app.loginInfo.userName
            }
        	app.ajax({
        		url: app.INTERFACE.getProjectList,
        		data: param,
        		success: function(res) {
                    var defaultProjNo =JSON.parse(localStorage.getItem("defaultProjNo")); 
                    for(var i = 0; i < res.beans.length; i++) {
                        if(defaultProjNo) {
                            if(res.beans[i].projectId == defaultProjNo.projectId) {
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
        },
        // 搜索人员
        searchBtn: function() {
        	var param = {
        		"projNo": app.loginInfo.projNo,
        		// "userName": app.loginInfo.userName
        		"userName": _this.serchVal.toUpperCase()
        	}
        	app.ajax({
        		url: app.INTERFACE.getCopyPerson,
        		data: param,
        		success: function(res) {
                    for(var i = 0; i < res.beans.length; i++) {
                        res.beans[i].checked = false;
                    }
        			_this.users = res.beans;
        		}
        	})
        },
        // 重置
        reset: function() {
            _this.serchVal = "";
        }
    }
})