var vm = new Vue({
	el: "#app",
	data: {
		eyeImg: "../../static/browse.png",
        showEye: false,
        typePwd: 'password' 
	},
	mounted: function() {
		var _this = this;
		function plusReady() {
			console.log("初始化plusReady");
		}
		if (window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
	},
	methods: {
		eye: function() {
            this.showEye = !this.showEye
            if(this.showEye) {
                this.eyeImg = "../../static/2-1-browse.png",
                this.typePwd = "text";
            } else {
                this.eyeImg = "../../static/browse.png";
                this.typePwd = 'password';
            }
            console.log(true)
        }
	}
})

