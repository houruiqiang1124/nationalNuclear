var _this = null;
new Vue({
    el: "#app",
    data: {
        showTab: true,
        imgList: "",
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
        showDelay: false,
        showDelayBtn: false,    //  是否显示底部延期申请通按钮
        showLuRu: true,
        confirmation: "",   // 确认情况
        closePerson: "",//关闭人
        closeDate: "",  //关闭日期
        disabled1: false,    // 是否可以输入
        disabled2: false,    // 是否可以输入
        submitParam: {  // 录入提交
            "traceId": "", // 流转表单id
            "instanceId": "",  // 实例id
            "userId": "", 
            "userName": "",
            "checkId": "",
            "dangerId": "",
            "responsiblePerson": "",   // 整改验证人
            "responsiblePersonId":"", // 整改验证人ID
            "rectificationSituation": "",  // 整改情况
            "completeDate":"",    // 完成日期
            "returndoc":"",    // 附件base64
            "copyPerson": [],  // 抄送
            "projNo": '',   // 项目id
            "recordNo": "", // 检查编号
            "lineNo": "",
            "stepId": "",
            "stepName": "",
            "stepCode": ""
            
        },
        responsiblePersonList: [],
    },
    mounted: function() {
		_this = this;
		function plusReady() {
			_this.listParam =plus.webview.currentWebview().params;
			console.log(_this.listParam.checkDate.time);
			_this.listParam.approveDate = _this.listParam.approveDate.time.replace(/\-/g, "/");
			_this.listParam.checkDate = _this.listParam.checkDate.time.replace(/\-/g, "/");
			_this.listParam.draftDate = _this.listParam.draftDate.time.replace(/\-/g, "/");
			_this.tabCode = plus.webview.currentWebview().tabCode.toString();
            _this.requestData();
            _this.init();
			_this.flowData();
			
            // _this.getCopyPerson();
            window.addEventListener('custom', function(e) {
                _this.submitParam.responsiblePerson = e.detail.name;
                _this.submitParam.responsiblePersonId = e.detail.id;
            	console.log(JSON.stringify(event.detail))
            })
		}
		if (window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
    },
    methods: {
        // 初始化信息
        init: function() {
            
            _this.submitParam.userId = app.loginInfo.userId;
            _this.submitParam.userName = app.loginInfo.userName;
            _this.submitParam.traceId = _this.listParam.actionTraceId;
            _this.submitParam.instanceId = _this.listParam.instanceId;
            _this.submitParam.checkId = _this.listParam.id;
            _this.submitParam.dangerId = _this.listParam.dangerId;
            // _this.submitParam.copyPerson = _this.listParam.copyPerson;
            var date = sne.getNowFormatDate();
            switch(_this.tabCode) {
            	case '0':
                    _this.submitParam.projNo =_this.listParam.projNo;
                    _this.submitParam.recordNo = _this.listParam.recordNo;;
                    _this.submitParam.lineNo = _this.listParam.lineNo;;
                    _this.submitParam.stepId = _this.listParam.stepId;;
                    _this.submitParam.stepName = _this.listParam.stepName;;
                    _this.submitParam.stepCode = _this.listParam.stepCode;;
                    if(_this.listParam.stepId == "100") {
                        _this.submitParam.completeDate =date;
                        _this.showButton =false;
                    } else if(_this.listParam.stepId == "200") {
                        _this.showDelay = true;
            			_this.submitParam.completeDate =date;
            		} else if(this.listParam.stepId == "300") {   // 100发起   200整改回复  300整改验证  400延期申请  500延期申请审批
            			_this.showVerify = true;
            			_this.showYanBtn = true;
            			_this.showButton =false;
            			_this.disabled1 = true;
                        _this.closePerson = app.loginInfo.userName;
                        _this.closeDate = sne.getNowFormatDate();
            			_this.submitParam.rectificationSituation = this.listParam.rectificationSituation;
            			_this.submitParam.responsiblePerson = this.listParam.responsiblePerson;
            			_this.submitParam.completeDate = sne.getNowFormatDate(this.listParam.completeDate.time); 
            			_this.submitParam.copyPerson = this.dangerData.copyPerson || "";
            		} else if(_this.listParam.stepId == "500") {
            			_this.showTongBtn = true;
            			_this.showButton =false;
                        _this.showDelayBtn = true;
                        _this.showLuRu = false;
            		}
            		break;
            	case '1':
                    _this.disabled1 = true
                    _this.submitParam.rectificationSituation = this.listParam.rectificationSituation;
                    _this.submitParam.responsiblePerson = this.listParam.responsiblePerson;
                    if(this.listParam.completeDate) {
                    	_this.submitParam.completeDate = sne.getNowFormatDate(this.listParam.completeDate.time); 
                    } else {
                    	_this.submitParam.completeDate = ""
                    }
                    if(_this.listParam.stepId == "100") {
                        _this.showLuRu = false;
                    } else if(_this.listParam.stepId == "300") {
                        _this.showVerify = true;
                        _this.closePerson = app.loginInfo.userName;
                        _this.closeDate = sne.getNowFormatDate().substr(0,10);
                    }
            		_this.showButton = false;    // 隐藏底部按钮，只读
            		_this.disabled = true;
            		break;
            	case '2':
                    _this.getInfo();
                    if(this.listParam.completeDate) {
                        _this.submitParam.completeDate = sne.getNowFormatDate(this.listParam.completeDate.time); 
                    } else {
                        _this.submitParam.completeDate = ""
                    }
            		if(_this.listParam.stepId == "500") {
            			_this.showBack = false;
            		} else {
            			_this.showBack = true;
            		}
            		
            		break;
            	case '3':
            		break;
            	case '4':
                    _this.getInfo();
            		break;
            	case '5':
            		_this.getInfo();
            		break;
            }
        },
        // 从已办，已阅，流转，待阅，初始化信息
        getInfo: function() {   //
            _this.disabled1 = true;
            _this.showVerify = true;
            _this.showButton = false;
            _this.submitParam.responsiblePerson = this.listParam.responsiblePerson;
            _this.submitParam.rectificationSituation = this.listParam.rectificationSituation;
            _this.submitParam.completeDate = sne.getNowFormatDate(this.listParam.completeDate.time);
            
        },
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
                        if(res.object.dangerList.hiddencategory == "0") {
                            res.object.dangerList.hiddencategory = "管理缺陷";
                        } else if(res.object.resultCode == "1") {
                            res.object.dangerList.hiddencategory = "人的不安全行为";
                        } else if(res.object.resultCode == "2") {
                            res.object.dangerList.hiddencategory = "物的不安全状态";
                        } else if(res.object.resultCode == "3") {
                            res.object.dangerList.hiddencategory = "环境的不安全因素";
                        }
                        _this.imgList = JSON.stringify(res.object.dangerList.hiddendoc).replace(/"/g,"")
                        // res.object.dangerList.hiddenDoc = JSON.stringify(res.object.dangerList.hiddenDoc).replace(/"/g,"")
						res.object.dangerList.reqcompletedate = sne.getNowFormatDate2(res.object.dangerList.reqcompletedate);
						res.object.dangerList.distributdate = sne.getNowFormatDate2(res.object.dangerList.distributdate);
						_this.dangerData = res.object.dangerList;
                        _this.submitParam.copyPerson = JSON.parse(res.object.dangerList.copyPerson);
                        _this.confirmation = res.object.dangerList.comfirmcontent;
                        _this.closePerson = res.object.dangerList.closeperson;
                        _this.closeDate = res.object.dangerList.closedate;
                        
					} else {
					}
				}
			})
		},
        // 延期页面跳转
        delay: function() {
            sne.navigateTo({
            	url: "./5-5HSE.html",
            	id: "5-5HSE.html",
				data:{
					params: {
						"actionTraceId": _this.listParam.actionTraceId,
						"instanceId": _this.listParam.instanceId,
						"dangerId": _this.listParam.dangerId,
						"checkId": _this.listParam.id,
						"reqCompleteDate": _this.dangerData.reqcompletedate,
                        "recordNo": _this.listParam.recordNo
					}
				}
            })
        },
        // 流转信息
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
		},
        // 时间选择
        showDate: function(e) {
            var options = {"beginYear":2014,"endYear":2025};
            var picker = new mui.DtPicker(options);
            picker.show(function(rs) {
            	_this.submitParam.completeDate = rs.text;
            });
        },
		//语音输入
		openVoice:function(e){
			console.log(e== 0)
			var options = {};
			options.engine = 'iFly';
			// alert("开始语音识别：");
			plus.speech.startRecognize(options, function(s) {
				if(e == 0){
					_this.submitParam.rectificationSituation += s.split("。")[0];
				}else{
					_this.confirmation += s.split("。")[0];
				}
			}, function(e) {
				mui.toast("语音识别失败：" + e.message);
			});
		},
        // 整改验证人选择
        showPicker: function() {
            var userPicker = new mui.PopPicker(); 
            userPicker.setData(_this.responsiblePersonList);
            userPicker.show(function(items) {
                console.log(JSON.stringify(items))
                _this.submitParam.responsiblePerson = items[0].text;
                _this.submitParam.responsiblePersonId = items[0].value;
            });
        },
        // 待办提交
        submit: function() {
            if(_this.submitParam.responsiblePersonId == "" && _this.submitParam.responsiblePerson == "") {
                mui.alert("请选取验证人");
                return false;
            }
            if(_this.submitParam.rectificationSituation == "") {
            	mui.alert("请填写验证情况");
            	return false;
            }
            app.ajax({
                url: app.INTERFACE.changeSubmit,
                data: _this.submitParam,
                success: function(res) {
                    var webview = plus.webview.getWebviewById("5-0HSE.html");
                    var number=0;
                    mui.fire(webview,'refresh',{
                    	number:number
                    });
                    mui.back();
                    mui.toast("提交成功");
                }
            })
        },
        // 待办退回
        back: function() {
            var param = {
                "userId": app.loginInfo.userId,
                "userName": app.loginInfo.userName,
                "actionTraceId": _this.listParam.actionTraceId,
                "instanceId": _this.listParam.instanceId,
                "projNo": this.listParam.projNo || "",
                "recordNo": this.listParam.recordNo || "",
                "lineNo": this.listParam.lineNo || ""
            }
            app.ajax({
                url: app.INTERFACE.findFefund,
                data: param,
                success: function(res) {
                    var webview = plus.webview.getWebviewById("5-0HSE.html");
                    var number=0;
                    mui.fire(webview,'refresh',{
                    	number:number
                    });
                    mui.back();
                    mui.toast("退回成功");
                }
            })
        },
        // 整改验证按钮
        isYanBtn(e) {
            let param = {
                isPass: e,//0通过1不通过
                comfirmContent: this.confirmation,//确认情况
                contractonPeople: this.listParam.responsiblePerson,//整改单编制人
                closePerson: this.closePerson,//关闭人
                closeDate: this.closeDate,//关闭日期
                corApprovePerson: this.closePerson,//批准人
                corApproveDate: this.closeDate,//批准日期
                traceId: this.listParam.actionTraceId,
                dangerId: this.listParam.dangerId,
                instanceId: this.listParam.instanceId,
                userId: app.loginInfo.userId,
                userName: app.loginInfo.userName,
                projNo: this.listParam.projNo || "",
                recordNo: this.listParam.recordNo || "",
                lineNo: this.listParam.lineNo || "",
                stepId: this.listParam.stepId || "",
                stepName: this.listParam.stepName || "",
                stepCode: this.listParam.stepCode || "",
                checkId: this.listParam.id
            }
            if(param.comfirmContent == "") {
                mui.alert("请填写确认情况");
                return;
            }
            app.ajax({
                url: app.INTERFACE.verification,
                data: param,
                success: function() {
                    var webview = plus.webview.getWebviewById("5-0HSE.html");
                    var number=0;
                    mui.fire(webview,'refresh',{
                    	number:number
                    });
                    mui.back();
                    mui.toast("提交成功");
                }
            })
        },
        // 转发
        findForwarding: function() {
            let param = {
                actionTraceId: this.listParam.actionTraceId,
                flowName: this.listParam.flowName,
                flowCode: this.listParam.flowCode,
                flowId: this.listParam.flowId,
                instanceId: this.listParam.instanceId,
                stepCode: this.listParam.stepCode,
                stepId: this.listParam.stepId,
                stepName: this.listParam.stepName,
                projNo: this.listParam.projNo || "",
                recordNo: this.listParam.recordNo || "",
                lineNo: this.listParam.lineNo || ""
            }
            sne.navigateTo({
                url: "5-6HSEcs.html",
                id: "5-6HSEcs.html",
                data:{
                    params: param
                }
            })
        },
        // 流转撤回
        findWithdrawTerminate: function() {
            app.ajax({
                url: app.INTERFACE.findWithdrawTerminate,
                data: {
                    "userId": app.loginInfo.userId,
                    "checkId": this.listParam.id
                },
                success: function(res) {
                    if(res.object.resultCode == 0) {
                        mui.back();
                        mui.toast(res.object.resultMsg)
                    } else {
                        mui.toast(res.object.resultMsg)
                    } 
                }
            })
        },
        // 延期申请通过与不通过
        delayBtn: function(e) {
            var param = {
                    pass: e, //0通过 1不通过
                    delayToApplyForDate: this.listParam.delayToApplyForDate, //延期日期
                    dangerId: this.listParam.dangerId, //隐患id
                    traceId: this.listParam.actionTraceId, //流转id
                    userId: app.loginInfo.userId, //用户id
                    userName: app.loginInfo.userName, //用户名称
                    delayToApplyId: this.listParam.delayToApplyId
                }
                app.ajax({
                    url: app.INTERFACE.checkPass,
                    data: param,
                    success: function(res) {
                        var webview = plus.webview.getWebviewById("5-0HSE.html");
                        var number=0;
                        mui.fire(webview,'refresh',{
                            number:number
                        });
                        mui.back();
                        mui.toast("提交成功");
                    }
                })
        },
        // 跳转抄送人员列表
        goCc: function() {
            sne.navigateTo({
            	url: "./chaoSong.html",
            	id: "chaoSong.html",
            	data: {
            		params: {
            			pageType: "detail"
            		}
            	}
            })
        }
    }
})