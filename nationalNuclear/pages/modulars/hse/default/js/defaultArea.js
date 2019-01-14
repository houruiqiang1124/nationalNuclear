var _this = null;

new Vue({
    el: "#app",
    data: {
        users: [],  
        checkedUser: [], // 选中人员信息
        activeClass: 'mui-collapse keep-unfold',
        isActive: true
    },
    mounted: function() {
        _this = this;
        function plusReady(){
            _this.checkedUser = JSON.parse(localStorage.getItem("useaArea")) || [];
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
            for(key in _this.checkedUser) {
                _this.checkedUser[key].checked = false;
            }
            localStorage.setItem("useaArea",JSON.stringify(_this.checkedUser))
            mui.back();
        },
        // 选中人员
        checkedChange: function(e, index) {
            console.log(JSON.stringify(e))
            e.checked = !e.checked;
            if(e.checked == true) {
                 _this.checkedUser.push(e);
            } else {
                _this.checkedUser.splice(index,1);
            }
        },
        // 选中父级
        checkFather: function(e, index) {
            console.log(JSON.stringify(e))
            e.checked = !e.checked;
            if(e.checked == true) {
                 _this.checkedUser.push(e);
            } else {
                _this.checkedUser.splice(index,1);
            }
        },
        //获取区域列表
        getCopyPerson: function() {
            var project = JSON.parse(localStorage.getItem("defaultProjNo"));
        	var param = {
        		"projNo": project && project.projectId || app.loginInfo.projNo,
        	}
        	app.ajax({
        		url: app.INTERFACE.getArea,
        		data: param,
        		success: function(res) {
                    for(var i = 0; i < res.beans.length; i++) {
                        res.beans[i].checked = false;
                        _this.checkStor(res.beans[i])
                        for(var j = 0; j<res.beans[i].child[0].length; j++) {
                            res.beans[i].child[0][j].checked = false;
                            res.beans[i].child[0][j].zonoId = res.beans[i].child[0][j].childZonoId;
                            res.beans[i].child[0][j].zonoName = res.beans[i].child[0][j].childZonoName;
                            _this.checkStor(res.beans[i].child[0][j])
                        }
                        
                    }
        			_this.users = res.beans; //抄送人
        		}
        	})
        },
        // 选中缓存人员
        checkStor: function(obj) {
            var user = JSON.parse(localStorage.getItem("useaArea"));
            if(user) {
                for(key in user) {
                    if(obj.zonoId == user[key].zonoId) {
                        obj.checked = true;
                    }
                }
            }
        }
    }
})