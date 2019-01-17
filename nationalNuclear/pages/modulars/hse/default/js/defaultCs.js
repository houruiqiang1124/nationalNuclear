var _this = null;

new Vue({
    el: "#app",
    data: {
        users: [],  
        checkedUser: [], // 选中人员信息
        serchVal: ""
    },
    mounted: function() {
        _this = this;
        function plusReady(){
            _this.checkedUser = JSON.parse(localStorage.getItem("defaultUser")) || [];
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
            localStorage.setItem("defaultUser",JSON.stringify(_this.checkedUser));
            mui.back();
        },
        // 选中人员
        checkedChange: function(e, index) {
            console.log(JSON.stringify(e))
            e.checked = !e.checked;
            if(e.checked == true) {
                 _this.checkedUser.push({
                     id: e.memberId,
                     name: e.memberName
                 });
            } else {
                _this.checkedUser.splice(index,1);
            }
        },
        //获取抄送人列表
        getCopyPerson: function() {
            var project = JSON.parse(localStorage.getItem("defaultProjNo"));
        	var param = {
        		"projNo":project && project.projectId || app.loginInfo.projNo,
        		// "userName": app.loginInfo.userName
        		"userName": ""
        	}
        	app.ajax({
        		url: app.INTERFACE.getCopyPerson,
        		data: param,
        		success: function(res) {
                    for(var i = 0; i < res.beans.length; i++) {
                        res.beans[i].checked = false;
                        _this.checkStor(res.beans[i])
                    }
        			_this.users = res.beans; //抄送人  
        		}
        	})
        },
        // 搜索人员
        searchBtn: function() {
            var project = JSON.parse(localStorage.getItem("defaultProjNo"));
        	var param = {
        		"projNo": project && project.projectId || app.loginInfo.projNo,
        		// "userName": app.loginInfo.userName
        		"userName": _this.serchVal.toUpperCase()
        	}
        	app.ajax({
        		url: app.INTERFACE.getCopyPerson,
        		data: param,
        		success: function(res) {
                    for(var i = 0; i < res.beans.length; i++) {
                        res.beans[i].checked = false;
                        _this.checkStor(res.beans[i])
                    }
        			_this.users = res.beans;
        		}
        	})
        },
        // 重置
        reset: function() {
            _this.serchVal = "";
        },
        // 选中缓存人员
        checkStor: function(obj) {
            var user = JSON.parse(localStorage.getItem("defaultUser"));
            if(user) {
                for(key in user) {
                    if(obj.memberId == user[key].id) {
                        obj.checked = true;
                    }
                }
            }
        }
    }
})