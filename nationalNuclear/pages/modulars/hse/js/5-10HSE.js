var _this = null;
new Vue({
	el: "#app",
	data: {
        title: "",
		showTab: true,
		imgList: "", // 附件 base64
		imageList: "", // 附件 文件
		fileImg: "", // 整改录入上传图片
		// recordNo:"",
		data: [], //流转信息
		listParam: {}, // 列表数据
		dangerData: {}, //隐患信息
		tabCode: "0",
		showadd: true,
		showButton: true, // 是否显示底部按钮
		showVerify: false, //是否显示整改验证
		showBack: false, // 是否显示撤回按钮
		showTongBtn: false, // 是否显示通过与不通过按钮
		showYanBtn: false, // 是否显示整改验证按钮
		showDelay: false,
		showDelayBtn: false, //  是否显示底部延期申请通按钮
		showLuRu: true,
        showFileImg: false, // 是否显示整改图片
        showImg: true,
        showDel: true,  // 显示图片删除
		showRead: false, // 是否显示已阅按钮
		confirmation: "", // 确认情况
		closePerson: "", //关闭人id
		closePersonName: "",
		closeDate: "", //关闭日期
		disabled1: false, // 是否可以输入
		disabled2: false, // 是否可以输入
		submitParam: { // 录入提交
			"traceId": "", // 流转表单id
			"instanceId": "", // 实例id
			"userId": "",
			"userName": "",
			"checkId": "",
			"dangerId": "",
			"responsiblePerson": "", // 整改验证人
			"responsiblePersonId": "", // 整改验证人ID
			"rectificationSituation": "", // 整改情况
			"completeDate": "", // 完成日期
			"imgName": "",
			"imgAddress": "",
			"copyPerson": [], // 抄送
			"projNo": '', // 项目id
			"recordNo": "", // 检查编号
			"lineNo": "",
			"stepId": "",
			"stepName": "",
			"stepCode": "",
			"checkForm": "",
			"correctiveRequest": "",
			"ifModify": "0",
			"returndoc": "", // 附件base64
		},
		responsiblePersonList: [],
	},
	mounted: function() {
		_this = this;

		function plusReady() {
			mui.previewImage();
			_this.listParam = plus.webview.currentWebview().params;
			console.log(_this.listParam.checkDate.time);
			_this.listParam.approveDate = _this.listParam.approveDate.time;
			_this.listParam.checkDate = _this.listParam.checkDate.time;
			_this.listParam.draftDate = _this.listParam.draftDate.time;
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
            switch(_this.listParam.stepId) {
                case '100':
                    _this.title = "检查发起";
                    break;
                case '200':
                    _this.title = "整改回复";
                    break;
                case '300':
                    _this.title = "整改验证";
                    break;
                case '400':
                case '500':
                    _this.title = "延期申请";
                    break;
            }
            if(_this.listParam.stepId == 500 || _this.listParam.stepId == 400) {
                _this.title = "延期申请"
            }
			_this.submitParam.userId = app.loginInfo.userId;
			_this.submitParam.userName = app.loginInfo.name;
			_this.submitParam.traceId = _this.listParam.actionTraceId;
			_this.submitParam.instanceId = _this.listParam.instanceId;
			_this.submitParam.checkId = _this.listParam.id;
			_this.submitParam.dangerId = _this.listParam.dangerId;
			_this.submitParam.checkForm = _this.listParam.checkForm;
			_this.submitParam.responsiblePerson = this.listParam.draftPerson;
			_this.submitParam.responsiblePersonId = this.listParam.draftPersonId;
			// _this.submitParam.copyPerson = _this.listParam.copyPerson;
			var date = sne.getNowFormatDate();
			switch (_this.tabCode) {
				case '0':
					_this.submitParam.projNo = _this.listParam.projNo;
					_this.submitParam.recordNo = _this.listParam.recordNo;;
					_this.submitParam.lineNo = _this.listParam.lineNo;;
					_this.submitParam.stepId = _this.listParam.stepId;;
					_this.submitParam.stepName = _this.listParam.stepName;;
					_this.submitParam.stepCode = _this.listParam.stepCode;;
					if (_this.listParam.stepId == "100") {
						_this.submitParam.completeDate = date;
						_this.showButton = false;
					} else if (_this.listParam.stepId == "200") {
						_this.showDelay = true;

						_this.submitParam.completeDate = date;
					} else if (this.listParam.stepId == "300") { // 100发起   200整改回复  300整改验证  400延期申请  500延期申请审批
						_this.showVerify = true;
                        _this.showDel = false;
						_this.showYanBtn = true;
						_this.showButton = false;
						_this.showadd = false;
						// _this.disabled1 = true;
						_this.closePerson = app.loginInfo.userName;
						_this.closePersonName = app.loginInfo.name;
						_this.closeDate = sne.getNowFormatDate();
						_this.submitParam.rectificationSituation = this.listParam.rectificationSituation;
						_this.submitParam.responsiblePerson = this.listParam.responsiblePerson;
						_this.submitParam.completeDate = sne.getNowFormatDate(this.listParam.completeDate.time);
						_this.submitParam.copyPerson = this.dangerData.copyPerson || "";
					} else if (_this.listParam.stepId == "500") {
						_this.showTongBtn = true;
						_this.showButton = false;
						_this.showDelayBtn = true;
						_this.showLuRu = false;
					}
					break;
				case '1':
                    _this.showDel = false;
					_this.disabled1 = true;
                    _this.showadd = false;
					_this.submitParam.rectificationSituation = this.listParam.rectificationSituation;
					_this.submitParam.responsiblePerson = this.listParam.responsiblePerson;
					if (this.listParam.completeDate) {
						_this.submitParam.completeDate = sne.getNowFormatDate(this.listParam.completeDate.time);
					} else {
						_this.submitParam.completeDate = ""
					}
					if (_this.listParam.stepId == "100") {
						_this.showLuRu = false;
					} else if (_this.listParam.stepId == "300") {
						_this.showVerify = true;
						_this.closePerson = app.loginInfo.userName;
						_this.closePersonName = app.loginInfo.name;
						_this.closeDate = sne.getNowFormatDate().substr(0, 10);
					}
					_this.showButton = false; // 隐藏底部按钮，只读
					_this.disabled = true;
                    _this.disabled2 = true;
					break;
				case '2':
					_this.getInfo();
					if (this.listParam.completeDate) {
						_this.submitParam.completeDate = sne.getNowFormatDate(this.listParam.completeDate.time);
					} else {
						_this.submitParam.completeDate = ""
					}
					if (_this.listParam.stepId == "500") {
						_this.showBack = false;
					} else {
						_this.showBack = true;
					}

					break;
				case '3':
					_this.getInfo();
					break;
				case '4':
					_this.showRead = true;
					_this.getInfo();
					break;
				case '5':
					_this.getInfo();
					break;
			}
		},
		// 从已办，已阅，流转，待阅，初始化信息
		getInfo: function() { //
            _this.showDel = false;
			_this.showadd = false;
			_this.disabled1 = true;
			_this.showVerify = true;
			_this.showButton = false;
            _this.disabled2 = true;
			_this.submitParam.responsiblePerson = this.listParam.responsiblePerson;
			_this.submitParam.rectificationSituation = this.listParam.rectificationSituation;
			_this.submitParam.completeDate = _this.listParam.completeDate ? sne.getNowFormatDate(this.listParam.completeDate.time) : "";
            _this.closePersonName = _this.listParam.closePerson;
            _this.closeDate = _this.listParam.closeDate ? sne.getNowFormatDate(this.listParam.closeDate.time) : "";
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
                        
						if (res.object.dangerList.hiddencategory == "0") {
							res.object.dangerList.hiddencategory = "管理缺陷";
						} else if (res.object.dangerList.hiddencategory == "1") {
							res.object.dangerList.hiddencategory = "人的不安全行为";
						} else if (res.object.dangerList.hiddencategory == "2") {
							res.object.dangerList.hiddencategory = "物的不安全状态";
						} else if (res.object.dangerList.hiddencategory == "3") {
							res.object.dangerList.hiddencategory = "环境的不安全因素";
						}
						if (res.object.dangerList.keyHidden == "0") {
							res.object.dangerList.keyHidden = "管理性关键隐患";
						} else if (res.object.dangerList.keyHidden == "1") {
							res.object.dangerList.keyHidden = "行为性关键隐患";
						} else if (res.object.dangerList.keyHidden == "2") {
							res.object.dangerList.keyHidden = "装置性关键隐患";
						}
						res.object.dangerList.ifModify = res.object.dangerList.ifModify == 0 ? "是" : "否"
						console.log(res.object.dangerList.ifModify)
                        _this.imgList = JSON.stringify(res.object.dangerList.hiddendoc).replace(/"/g, "")
						_this.fileImg = JSON.stringify(res.object.dangerList.returndoc).replace(/"/g, "")
						// res.object.dangerList.hiddenDoc = JSON.stringify(res.object.dangerList.hiddenDoc).replace(/"/g,"")
						res.object.dangerList.reqcompletedate = sne.getNowFormatDate(res.object.dangerList.reqcompletedate);
						res.object.dangerList.distributdate = sne.getNowFormatDate(res.object.dangerList.distributdate);
						_this.dangerData = res.object.dangerList;
						_this.submitParam.copyPerson = JSON.parse(res.object.dangerList.copyPerson);
						_this.confirmation = res.object.dangerList.comfirmcontent;
						//                         _this.closePerson = res.object.dangerList.closeperson;
						//                         _this.closeDate = res.object.dangerList.closedate;
                        if(_this.fileImg == "null") {
                            _this.showFileImg = false;
                        } else {
                            _this.showFileImg = true;
                        }
                        if(_this.imgList == "null") {
                            _this.showImg = false;
                        } else {
                            _this.showImg = true;
                        }
//                         if(_this.tabCode != 0) {
//                             _this.submitParam.completeDate = res.object.dangerList.completeDate
//                         }
					} else {}
				}
			})
		},
		// 延期页面跳转
		delay: function() {
			sne.navigateTo({
				url: "./5-5HSE.html",
				id: "5-5HSE.html",
				data: {
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
		flowData: function() {
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
					} else {}
				}
			})
		},
		// 时间选择
		showDate: function(e) {
			var options = {
				"beginYear": 2014,
				"endYear": 2025,
                "value": ""
			};
			var picker = new mui.DtPicker(options);
			picker.show(function(rs) {
				_this.submitParam.completeDate = rs.text;
			});
		},
		//语音输入
		openVoice: function(e) {
			console.log(e == 0)
			var options = {};
			options.engine = 'iFly';
			// alert("开始语音识别：");
			plus.speech.startRecognize(options, function(s) {
				if (e == 0) {
					_this.submitParam.rectificationSituation += s;
				} else {
					_this.confirmation += s;
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
// 				_this.submitParam.responsiblePerson = items[0].text;
// 				_this.submitParam.responsiblePersonId = items[0].value;
                localStorage.setItem("imgName",response.img);
                localStorage.setItem("imgAddress","/" + response.url);
			});
		},
        // 提交或保存
        submit: function() {
            if(_this.imageList == ""){
                _this.sureSubmit();
            }else{
                _this.upload(_this.imageList, function() {
                    _this.sureSubmit();
                });
            } 
        },
		// 待办提交
		sureSubmit: function() {
            _this.submitParam.imgName = localStorage.getItem("imgName") || "";
            _this.submitParam.imgAddress = localStorage.getItem("imgAddress") || "";
            console.log(_this.submitParam.checkForm)
            if (_this.submitParam.checkForm == '日常检查') {
                _this.submitParam.checkForm = '0'
            } else if (_this.submitParam.checkForm == '专项检查') {
                _this.submitParam.checkForm = '1'
            } else if (_this.submitParam.checkForm == '综合检查') {
                _this.submitParam.checkForm = '2'
            }
            _this.submitParam.correctiveRequest = _this.dangerData.correctiverequest;
            // console.log($("input[name='ifModify']:checked").val())
            if (_this.submitParam.responsiblePersonId == "" && _this.submitParam.responsiblePerson == "") {
                mui.alert("请选取验证人");
                return false;
            }
            if (_this.submitParam.rectificationSituation == "") {
                mui.alert("请填写验证情况");
                return false;
            }
            app.ajax({
                url: app.INTERFACE.changeSubmit,
                data: _this.submitParam,
                success: function(res) {
                    if(_this.imageList != ""){
                        localStorage.removeItem("imgName")
                        localStorage.removeItem("imgAddress")
                    }
                    var webview = plus.webview.getWebviewById("5-0HSE.html");
                    var number = 0;
                    mui.fire(webview, 'refresh', {
                        number: number
                    });
                    sne.refreshHome();
                    mui.back();
                    mui.toast("提交成功");
                },
                })
		},
		// 待办退回
		back: function() {
			var param = {
				"userId": app.loginInfo.userId,
				"userName": app.loginInfo.name,
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
					var number = 0;
					mui.fire(webview, 'refresh', {
						number: number
					});
                    sne.refreshHome();
					mui.back();
					mui.toast("退回成功");
				}
			})
		},
		// 整改验证按钮
		isYanBtn(e) {
			if (_this.submitParam.checkForm == '日常检查') {
				_this.submitParam.checkForm = '0'
			} else if (_this.submitParam.checkForm == '专项检查') {
				_this.submitParam.checkForm = '1'
			} else if (_this.submitParam.checkForm == '综合检查') {
				_this.submitParam.checkForm = '2'
			}
			let param = {
				isPass: e, //0通过1不通过
				comfirmContent: this.confirmation, //确认情况
				contractonPeople: this.listParam.responsiblePerson, //整改单编制人
				closePerson: this.closePerson, //关闭人
				closeDate: this.closeDate, //关闭日期
				corApprovePerson: this.closePerson, //批准人
				corApproveDate: this.closeDate, //批准日期
				traceId: this.listParam.actionTraceId,
				dangerId: this.listParam.dangerId,
				instanceId: this.listParam.instanceId,
				userId: app.loginInfo.userId,
				userName: app.loginInfo.name,
				projNo: this.listParam.projNo || "",
				recordNo: this.listParam.recordNo || "",
				lineNo: this.listParam.lineNo || "",
				stepId: this.listParam.stepId || "",
				stepName: this.listParam.stepName || "",
				stepCode: this.listParam.stepCode || "",
				checkId: this.listParam.id,
				checkForm: _this.submitParam.checkForm
			}
			if (param.comfirmContent == "") {
				mui.alert("请填写确认情况");
				return;
			}
			app.ajax({
				url: app.INTERFACE.verification,
				data: param,
				success: function() {
					var webview = plus.webview.getWebviewById("5-0HSE.html");
					var number = 0;
					mui.fire(webview, 'refresh', {
						number: number
					});
                    sne.refreshHome();
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
				data: {
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
					if (res.object.resultCode == 0) {
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
				userName: app.loginInfo.name, //用户名称
				delayToApplyId: this.listParam.delayToApplyId
			}
			app.ajax({
				url: app.INTERFACE.checkPass,
				data: param,
				success: function(res) {
					var webview = plus.webview.getWebviewById("5-0HSE.html");
					var number = 0;
					mui.fire(webview, 'refresh', {
						number: number
					});
                    sne.refreshHome();
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
		},
		// 点击已阅
		read: function() {
			app.ajax({
				url: app.INTERFACE.updateHaveRead,
				data: {
					deliveryId: _this.listParam.deliveryId
				},
				success: function(res) {
					var webview = plus.webview.getWebviewById("5-0HSE.html");
					var number = 4;
					mui.fire(webview, 'refresh', {
						number: number
					});
					mui.back();
					mui.toast("已阅成功");
					console.log("已阅");
				}
			})
		},
		// 附件上传
		fileUpLoad: function() {
			var btns = [{
				title: "拍摄"
			}, {
				title: "系统相册"
			}];
			plus.nativeUI.actionSheet({
				cancel: "取消",
				buttons: btns
			}, function(e) {
				var i = e.index;
				//拍照
				switch (i) {
					case 1:
						_this.getImage();
						break;
					case 2:
						_this.galleryImg();
						break;
				}
			});
		},
		// 系统相册
		galleryImg: function() {
			//         	plus.gallery.pick(function(path) {
			//         		_this.appendFile(path); //处理图片的地方
			//         	});
			plus.gallery.pick(function(e) {
				_this.imagesZip(e.files[0])
				// $("#img").attr("src",e.target); 
				// 				console.log(e.files[0])
				// 				return;
				_this.appendFile(e.files[0]); //处理图片的地方
				// var files = document.getElementById('img');
			}, function(e) {
				console.log("取消选择图片");
			}, {
				filter: "image",
				multiple: true,
				maximum: 1,
				system: false,
				onmaxed: function() {
					plus.nativeUI.alert('最多只能选择1张图片');
				}
			});
		},
		// 拍摄
		getImage: function() {
			var cmr = plus.camera.getCamera();
			cmr.captureImage(function(p) {
				plus.io.resolveLocalFileSystemURL(p, function(entry) {
					var localurl = entry.toLocalURL(); //把拍照的目录路径，变成本地url路径，例如file:///........之类的。
					_this.appendFile(localurl);
				});
			}, function(error) {
				console.log("Capture image failed: " + error.message);
			});
		},
		// 转换base64
		appendFile: function(path) {
			var img = new Image();
			img.src = path; // 传过来的图片路径在这里用。
			img.onload = function() {
				var that = this;
				//生成比例
				var w = that.width,
					h = that.height,
					scale = w / h;
				w = 240 || w; //480  你想压缩到多大，改这里
				h = w / scale;
				//生成canvas
				var canvas = document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				$(canvas).attr({
					width: w,
					height: h
				});
				ctx.drawImage(that, 0, 0, w, h);
				var base64 = canvas.toDataURL('image/jpeg', 1 || 0.8); //1最清晰，越低越模糊。
				_this.showImg = true;
				_this.fileImg = base64;
                _this.showFileImg = true;
				_this.submitParam.returndoc = base64;
				// _this.upload(base64);
			}
		},
		//压缩图片
		imagesZip: function(path) {
			plus.zip.compressImage({
				src: path,
				dst: "_doc/chat/gallery/" + path,
				quality: 20,
				overwrite: true
			}, function(e) {
				_this.imageList = e.target;
			}, function(err) {
				console.error("压缩失败：" + err.message);
			});
		},
		// 上传用友服务器
		upload: function(src, fn) {
			var task = plus.uploader.createUpload(app.INTERFACE.imgUplodChange, {
					method: "POST",
					blocksize: 204800,
					priority: 100,
				},
				function(t, status) { //上传完成
					if (status == 200) {
						console.log("上传成功：" + t.responseText);
						var response = JSON.parse(t.responseText).object;
						_this.submitParam.imgName = response.img;
						_this.submitParam.imgAddress = "/" + response.url;
						fn();
					} else {
						console.log("上传失败：" + status);
					}
				}
			);
			//添加其他参数
			task.addFile(src, {
				key: "file"
			});
			task.start();
		},
		// 删除图片
		closeImg: function() {
			_this.fileImg = "";
            _this.showFileImg = false;
		}
	}
})
