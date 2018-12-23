var _this = null;
new Vue({
    el: "#app",
    data: {
        showTab: true,
		// recordNo:"",
		data:[],//流转信息
		listParam:{},// 列表数据
		dangerData:{},//隐患信息
		tabCode:"0",
		showButton: true,    // 是否显示底部按钮
		showVerify: false,   //是否显示整改验证
		showBack: false, // 是否显示撤回按钮
		showTongBtn: false,  // 是否显示通过与不通过按钮
		showYanBtn: false,  // 是否显示整改验证按钮
    },
    mounted: function() {
		_this = this;
		function plusReady() {
			_this.listParam =plus.webview.currentWebview().params;
			_this.listParam.approveDate = _this.listParam.approveDate.time;
			_this.listParam.checkDate = _this.listParam.checkDate.time;
			_this.listParam.draftDate = _this.listParam.draftDate.time;
// 			console.log(JSON.stringify(_this.listParam))
// 			console.log(_this.listParam.checkDate.time)
			_this.tabCode = plus.webview.currentWebview().tabCode;
			_this.flowData();
			_this.requestData();
			switch(_this.tabCode) {
                case 0:
                    if(this.listParam.stepId == "300") {   // 100发起   200整改回复  300整改验证  400延期申请  500延期申请审批
                        this.showVerify = true;
                        this.showYanBtn = true;
                        this.showButton =false;
                        this.disabled = true;
                        this.submitParam.rectificationSituation = this.listParam.rectificationSituation;
                        this.submitParam.responsiblePerson = this.listParam.responsiblePerson;
                        this.submitParam.completeDate = getNowFormatDate(this.listParam.completeDate.time); 
                        this.submitParam.copyPerson = this.dangerData.copyPerson || "";
                    } else if(this.listParam.stepId == "500") {
                        this.showTongBtn = true;
                        this.showButton =false;
                    }
                    break;
                case 1:
                    this.showButton = false;    // 隐藏底部按钮，只读
                    this.disabled = true;
                    break;
                case 2:
                    if(this.listParam.stepId == "500") {
                        this.showBack = false;
                    } else {
                        this.showBack = true;
                    }
                    this.showButton = false;
                    this.disabled = true;
                    
                    break;
                case 3:
                    this.showButton = false;
                    break;
                case 4:
                    this.showButton = false;
                    this.disabled = true;
                    break;
                case 5:
                    this.showButton = false;
                    this.disabled = true;
                    break;
            }
		}
		if (window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
    },
    methods: {
		//详情
		requestData: function() {
			var param = {
				"checkId": _this.listParam.id,
			}
			app.ajax({
				url: app.INTERFACE.selectDanger,
				data: param,
				success: function(res) {
					if (res.object.resultCode == "0") {
						res.object.dangerList.reqcompletedate = sne.getNowFormatDate2(res.object.dangerList.reqcompletedate);
						res.object.dangerList.distributdate = sne.getNowFormatDate2(res.object.dangerList.distributdate);
						_this.dangerData = res.object.dangerList;
					} else {
					}
				}
			})
		},
        delay: function() {
            sne.navigateTo({
            	url: "./5-5HSE.html",
            	id: "5-5HSE.html"
            })
        },
		flowData:function(){
			plus.nativeUI.showWaiting();
			var param = {
				"recordNo": _this.listParam.recordNo,
			}
			app.ajax({
				url: app.INTERFACE.hseCirculation,
				data: param,
				success: function(res) {
					if (res.object.resultCode == "0") {
						plus.nativeUI.closeWaiting();
						if (!res.beans) {
							return;
						}
                        let List = res.beans.map((val, index) => {
                            val.arriveTime.time = sne.getNowFormatDate(val.arriveTime.time);
                            val.actionName = val.actionName ? val.actionName : "";
                            return val;
                        })
                        _this.data = List;
					} else {
					}
				}
			})
		}
    }
})