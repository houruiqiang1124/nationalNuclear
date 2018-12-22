new Vue({
	el: "#app",
	data: {

	},
	mounted: function() {

	},
	methods: {
		// hse设置跳转
		hseSet: function() {
			console.log("true")
			sne.navigateTo({
				url: "./5-2HSE.html",
				id: "5-2HSE.html"
			})
		},
		// 新建检查单
		newCheck: function() {
			sne.navigateTo({
				url: "./5-3HSE.html",
				id: "5-3HSE.html"
			})
		},
		// 去详情
		goDetail: function() {
			sne.navigateTo({
				url: "./5-10HSE.html",
				id: "5-10HSE.html"
			})
		}

	}
})
