mui.init({
	pullRefresh: {
		container: '#refreshContainer',
		down: {
			callback: pullDownfresh
		},
		up: {
			callback: pullUpfresh
		}
	}
});

function plusReady() {

}
if (window.plus) {
	plusReady()
} else {
	document.addEventListener('plusready', plusReady, false);
}

function pullDownfresh() {
	setTimeout(
		function() {
			alert("下拉刷新");
			mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
		}, 1000);
}

function pullUpfresh() {
	var self = this;
	setTimeout(
		function() {
			alert("上拉加载");
			self.endPullupToRefresh(false);
		}, 1000);
}
