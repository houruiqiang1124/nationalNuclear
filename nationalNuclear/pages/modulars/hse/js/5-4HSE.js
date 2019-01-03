var _this = this;
new Vue({
	el: "#app",
	data: {
		showTab: true,
		imgList: "", // 附件
		imageList: "",
		showImg: false,
		prevParam: {}, // 上个页面过来的参数
		data: [], //流转信息
		personType: "0", //判断是责任还是抄送 0责任  1抄送
		saveParam: { // 新建保存和提交传的参数
			"projNo": "", // 项目
			"checkDate": "", // 检查日期
			"checkPerson": "", // 检查人
			"checkForm": "0", // 检查形式
			"draftUnit": "", // 编制单位
			"draftDept": "", // 编制部门
			"draftPerson": "", //编制人
			"draftDate": "", //编制日期
			"recordType": "0", // 业主联队检查单类型(后期更改)
			"userId": "", //用户ID
			"userName": "", // 用户名称
			"unit": "", // 机组
			"area": "", // 区域
			"unitID": "", // 被检查单位
			"hseHiddenLevel": "0", // 隐患级别 一般0 重大1
			"hiddenCategory": "", // 隐患属性
			"nonconformity": "", // 隐患类型
			"reqCompleteDate": "", // 要求完成时间
			"hiddenDescription": "", // 隐患描述
			"correctiveRequest": "", // 整改措施要求
			"contractonPeople": "0", // 整改单编制人(后期修改)
			"responsiblePerson": "", // 责任整改人
			"responsiblePersonId": "", // 责任整改人ID  
			"copyPerson": [], // 抄送
			"state": "1", // 保存0或提交1
			"traceId": "", // 流转表ID
			"instanceId": "", // 实例id
			"dangerId": "",
			"checkId": "",
			"imgName": "",
			"imgAddress": "",
			"keyHidden": "",
			"ifModify": "",
			"hiddenDoc": "",
		},
		// 		        unitList: [{
		// 		        	"uniteEnglishDesc": "State Nuclear Power PWR Demonstration Project Unit 1",
		// 		        	"unitDesc": "国核示范1号机组",
		// 		        	"projectsByArea": "SNG",
		// 		        	"text": "国核示范1号机组1",
		// 		        	"value": "SN1"
		// 		        }, {
		// 		        	"uniteEnglishDesc": "State Nuclear Power PWR Demonstration Project Unit 2",
		// 		        	"unitDesc": "国核示范2号机组",
		// 		        	"projectsByArea": "SNG",
		// 		        	"text": "国核示范2号机组1",
		// 		        	"value": "SN2"
		// 		        }, {
		// 		        	"uniteEnglishDesc": "State Nuclear Power PWR Demonstration Project Phase I and Units 1&amp;2",
		// 		        	"unitDesc": "国核示范1/2号机组共用",
		// 		        	"projectsByArea": "SNG",
		// 		        	"text": "国核示范1/2号机组共用1",
		// 		        	"value": "SNG"
		// 		        }],
		unitList: [],
		areaList: [
			// 								{
			// 			        	"value": "1",
			// 			        	"text": "核岛"
			// 			        }, {
			// 			        	"value": "1.1",
			// 			        	"text": "核岛-1厂房"
			// 			        }, {
			// 			        	"value": "1.2",
			// 			        	"text": "核岛-2厂房"
			// 			        }, {
			// 			        	"value": "1.3",
			// 			        	"text": "核岛-3厂房"
			// 			        },
		],
		unitIDList: [
			// 								{
			// 			        	"organizeCode": "SNG",
			// 			        	"projectsByArea": "SNG",
			// 			        	"value": "SNG",
			// 			        	"text": "示范电站/石岛湾项目部"
			// 			        }, {
			// 			        	"organizeCode": "NNICA-SNG",
			// 			        	"projectsByArea": "SNG",
			// 			        	"value": "NNICA-SNG",
			// 			        	"text": "示范电站/石岛湾-华兴"
			// 			        }, {
			// 			        	"organizeCode": "NNEC-SNG",
			// 			        	"projectsByArea": "SNG",
			// 			        	"value": "NNEC-SNG",
			// 			        	"text": "示范电站/石岛湾-中核二三"
			// 			        }, {
			// 			        	"organizeCode": "NZHD-SNG",
			// 			        	"projectsByArea": "SNG",
			// 			        	"value": "NZHD-SNG",
			// 			        	"text": "示范电站/石岛湾-浙江火电"
			// 			        },
		],
		nonconformityList: [
			// 								{
			// 			        	"hazardTypeSeriar": "1",
			// 			        	"hazardTypeDesc": "32",
			// 			        	"value": "1",
			// 			        	"text": "23"
			// 			        }, {
			// 			        	"hazardTypeSeriar": "2",
			// 			        	"hazardTypeDesc": "3232",
			// 			        	"value": "2",
			// 			        	"text": "13"
			// 			        }, {
			// 			        	"hazardTypeSeriar": "1",
			// 			        	"hazardTypeDesc": "32",
			// 			        	"value": "3",
			// 			        	"text": "15"
			// 			        },
		],
		hiddenCategoryList: [{
			value: "0",
			text: "管理缺陷"
		}, {
			value: "1",
			text: "人的不安全行为"
		}, {
			value: "2",
			text: "物的不安全状态"
		}, {
			value: "3",
			text: "环境的不安全因素"
		}],
		keyHiddenList: [{
			value: "0",
			text: "管理性关键隐患"
		}, {
			value: "1",
			text: "行为性关键隐患"
		}, {
			value: "2",
			text: "装置性关键隐患"
		}]
	},
	mounted: function() {
		_this = this;
		console.log("进入待办退回")

		function plusReady() {
			mui.previewImage();
			_this.prevParam = plus.webview.currentWebview().params;
			_this.init();
			_this.getUnit();
			_this.getArea();
			_this.getInspectedUnit();
			_this.getHazardTypeList();
			_this.requestData();
			window.addEventListener('custom', function(e) {
				if (_this.personType == 0) {
					_this.saveParam.responsiblePerson = e.detail.name;
					_this.saveParam.responsiblePersonId = e.detail.id;
				} else if (_this.personType == 1) {
					if (_this.saveParam.copyPerson.length < 1) {
						var Operson = {
							id: e.detail.id,
							name: e.detail.name
						}
						_this.saveParam.copyPerson.push(Operson)
					} else {
						var flag = true;
						for (var i = 0; i < _this.saveParam.copyPerson.length; i++) {
							if (_this.saveParam.copyPerson[i].id == e.detail.id) {
								mui.alert("不能选择相同的抄送人");
								flag = false;
								return flag;
							}
						}
						if (flag) {
							var Operson = {
								id: e.detail.id,
								name: e.detail.name
							}
							_this.saveParam.copyPerson.push(Operson)
						}
					}
				} else if (_this.personType == 2) {
					_this.saveParam.checkPerson = e.detail.name;
					_this.saveParam.checkPersonId = e.detail.id;
				}
			});
            window.addEventListener("CC", function(e) {
                var detail = JSON.parse(e.detail.param);
                var newArr = _this.getArrDifference(_this.saveParam.copyPerson, detail)
                 _this.saveParam.copyPerson = newArr;
            })
		}
		if (window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
	},
	methods: {
		// 初始化
		init: function() {
			var date = sne.getNowFormatDate();
			_this.saveParam.userId = app.loginInfo.userId;
			_this.saveParam.userName = app.loginInfo.name;
			_this.saveParam.projNo = app.loginInfo.projNo;
			_this.saveParam.draftUnit = app.loginInfo.organizationId;
			_this.saveParam.draftDept = app.loginInfo.departmentId;
			_this.saveParam.draftPerson = app.loginInfo.userName;
			_this.saveParam.draftDate = sne.getNowFormatDate();
			_this.saveParam.checkDate = date;
			_this.saveParam.checkPerson = app.loginInfo.name;
			// _this.saveParam.reqCompleteDate = date;
			_this.saveParam.traceId = _this.prevParam.traceId
			_this.saveParam.instanceId = _this.prevParam.instanceId
			_this.saveParam.dangerId = _this.prevParam.dangerId
			_this.saveParam.checkId = _this.prevParam.checkId
		},
        // 去重
        getArrDifference: function(array1, array2) {
             var result = _this.saveParam.copyPerson;
            for(var i = 0; i < array2.length; i++){
                var obj = array2[i];
                var num = obj.id;
                var isExist = false;
                for(var j = 0; j < array1.length; j++){
                    var aj = array1[j];
                    var n = aj.id;
                    if(n == num){
                        isExist = true;
                        break;
                    }
                }
                if(!isExist){
                    result.push(obj);
                }
            }
            return result;
        },
		//详情
		requestData: function() {
			var param = {
				"checkId": _this.prevParam.checkId,
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
						//关键隐患
						if (_this.saveParam.keyHidden == "0") {
							_this.saveParam.keyHidden = "管理性关键隐患";
						} else if (_this.saveParam.keyHidden == "1") {
							_this.saveParam.keyHidden = "行为性关键隐患";
						} else if (_this.saveParam.keyHidden == "2") {
							_this.saveParam.keyHidden = "装置性关键隐患";
						}
						// res.object.dangerList.reqcompletedate = sne.getNowFormatDate(res.object.dangerList.reqcompletedate).replace(/\-/g, "/");
						// res.object.dangerList.distributdate = sne.getNowFormatDate(res.object.dangerList.distributdate).replace(/\-/g, "/");
						_this.dangerData = res.object.dangerList;
						_this.saveParam.copyPerson = JSON.parse(res.object.dangerList.copyPerson);
						_this.saveParam.unit = _this.dangerData.unit;
						_this.saveParam.area = _this.dangerData.area;
						_this.saveParam.unitID = _this.dangerData.unitid;
						_this.saveParam.nonconformity = _this.dangerData.nonconformity;
						_this.saveParam.hiddenCategory = _this.dangerData.hiddencategory;
						_this.saveParam.reqCompleteDate = sne.getNowFormatDate(_this.dangerData.reqcompletedate);
						$("#hsehiddenlevel").find("input[value='" + _this.dangerData.hsehiddenlevel + "']").attr("checked",
							"checked");
						$("#ifModify").find("input[value='" + _this.dangerData.ifModify + "']").attr("checked", "checked");
						_this.saveParam.hiddenDescription = _this.dangerData.hiddendescription;
						_this.saveParam.correctiveRequest = _this.dangerData.correctiverequest;
						_this.saveParam.responsiblePerson = _this.dangerData.responsibleperson;
						_this.saveParam.responsiblePersonId = _this.dangerData.responsiblepersonid;
                        _this.imgList = JSON.stringify(res.object.dangerList.hiddendoc).replace(/"/g, "")
						// 						_this.confirmation = res.object.dangerList.comfirmcontent;
						// 						_this.closePerson = res.object.dangerList.closeperson;
						// 						_this.closeDate = res.object.dangerList.closedate;
					} else {}
				}
			})
		},
		// 点击切换导航栏
		changeNav: function(e) {
			this.showTab = e;
			if (this.data.length == 0) {
				_this.flowData();
			}
		},
		//获取机组
		getUnit: function() {
			var param = {
				"projNo": app.loginInfo.projNo,
			}
			app.ajax({
				url: app.INTERFACE.getUnit,
				data: param,
				success: function(res) {
					var List = res.beans.map((val, index) => {
						val.text = val.unitName;
						val.value = val.unitId;
						return val;
					})
					_this.unitList = List;
				}
			})
		},
		//获取区域
		getArea: function() {
			var param = {
				"projNo": app.loginInfo.projNo,
			}
			app.ajax({
				url: app.INTERFACE.getArea,
				data: param,
				success: function(res) {
					var List = res.beans.map((val, index) => {
						var childrenArr = []
						for (var i = 0; i < val.child[0].length; i++) {
							childrenArr.push({
								value: val.child[0][i].childZonoId,
								text: val.child[0][i].childZonoName
							})
						}
						var area = {
							value: val.zonoId,
							text: val.zonoName,
							children: childrenArr
						}
						return area;
					})
					_this.areaList = List;
				}
			})
		},
		//获取被检查单位
		getInspectedUnit: function() {
			var param = {
				"projNo": app.loginInfo.projNo,
			}
			app.ajax({
				url: app.INTERFACE.getInspectedUnit,
				data: param,
				success: function(res) {
					var List = res.beans.map((val, index) => {
						val.text = val.organizeName;
						val.value = val.organizeId;
						return val;
					})
					_this.unitIDList = List;
				}
			})
		},
		//获取隐患类型
		getHazardTypeList: function() {
			var param = {
				"projNo": app.loginInfo.projNo,
			}
			app.ajax({
				url: app.INTERFACE.getHazardTypeList,
				data: param,
				success: function(res) {
					var List = res.beans.map((val, index) => {
						val.text = val.hazardTypeName;
						val.value = val.hazardTypeId;
						return val;
					})
					_this.nonconformityList = List;
				}
			})
		},
		// 日期选择
		checkDate: function(e) {
			console.log(e)
			var options = {
				// "type": "date",
				"beginYear": 2014,
				"endYear": 2025
			};
			var picker = new mui.DtPicker(options);
			picker.show(function(rs) {
				_this.saveParam[e] = rs.text;
			});
		},
		// 选择器
		showPicker: function(e) {
			var userPicker = new mui.PopPicker();
			var list = e + "List";
			userPicker.setData(_this[e + "List"]);
			userPicker.show(function(items) {
				if (e == "copyPerson") {
					_this.saveParam[e].push({
						id: items[0].value,
						name: items[0].text
					})
				} else {
					_this.saveParam[e] = items[0].text;
				}
				if (e == "responsiblePerson") {
					_this.saveParam.responsiblePersonId = items[0].value;
				}
			});
		},
		//语音输入
		openVoice: function(e) {
			var options = {};
			options.engine = 'iFly';
			// alert("开始语音识别：");
			plus.speech.startRecognize(options, function(s) {
				if (e == 0) {
					_this.saveParam.hiddenDescription += s;
				} else {
					_this.saveParam.correctiveRequest += s;
				}
			}, function(e) {
				mui.toast("语音识别失败：" + e.message);
			});
		},
		// 附件上传
		fileUpLoad: function() {
			if (_this.imgList.length > 1) {
				mui.toast("暂时只能上传一张")
				return;
			}
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
			// 			plus.gallery.pick(function(path) {
			// 				_this.appendFile(path); //处理图片的地方
			// 			});
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
					_this.imagesZip(localurl)
				});
			}, function(error) {
				console.log("Capture image failed: " + error.message);
			});
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
				w = 480 || w; //480  你想压缩到多大，改这里
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
				_this.imgList = base64;
				_this.upload(base64);
			}
		},
		// 上传服务器
		upload: function(src, fn) {
			plus.nativeUI.showWaiting();
			var task = plus.uploader.createUpload(app.INTERFACE.imgUplodNew, {
					method: "POST",
					blocksize: 204800,
					priority: 100,
				},
				function(t, status) { //上传完成
					if (status == 200) {
						plus.nativeUI.closeWaiting();
						console.log("上传成功：" + t.responseText);
						var response = JSON.parse(t.responseText).object;
						// 						_this.saveParam.imgName = response.img;
						// 						_this.saveParam.imgAddress = "/" + response.url;
						localStorage.setItem("imgName", response.img);
						localStorage.setItem("imgAddress", "/" + response.url);
						fn();
					} else {
						plus.nativeUI.closeWaiting();
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
		// 提交或保存
		sureSubmit: function() {
			_this.saveParam.imgName = localStorage.getItem("imgName") || "";
			_this.saveParam.imgAddress = localStorage.getItem("imgAddress") || "";
			_this.saveParam.ifModify = $("input[name='ifModify']:checked").val();
			_this.saveParam.hseHiddenLevel = $("input[name='choose']:checked").val();
			_this.saveParam.hiddenDoc = _this.imgList;
			if (_this.saveParam.hiddenCategory == "管理缺陷") {
				_this.saveParam.hiddenCategory = 0
			} else if (_this.saveParam.hiddenCategory == "人的不安全行为") {
				_this.saveParam.hiddenCategory = 1

			} else if (_this.saveParam.hiddenCategory == "物的不安全状态") {
				_this.saveParam.hiddenCategory = 2

			} else if (_this.saveParam.hiddenCategory == "环境的不安全因素") {
				_this.saveParam.hiddenCategory = 3
			}
			if (_this.checkParam()) {
				app.ajax({
					url: app.INTERFACE.retResubmit,
					data: _this.saveParam,
					success: function(res) {
						if (res.object.resultCode == 0) {
                            if(_this.imageList != ""){
                                localStorage.removeItem("imgName")
                                localStorage.removeItem("imgAddress")
                            }
							mui.toast("提交成功");
							var webview = plus.webview.getWebviewById("5-0HSE.html");
							var number = 0;
							mui.fire(webview, 'refresh', {
								number: number
							});
							mui.back();
						}
					}
				})
			}
		},
		// 流转信息
		flowData: function() {
			var param = {
				"recordNo": _this.prevParam.recordNo,
			}
			app.ajax({
				url: app.INTERFACE.hseCirculation,
				data: param,
				success: function(res) {
					if (res.object.resultCode == "0") {
						if (!res.beans) {
							return;
						}
						let List = res.beans.map((val, index) => {
							val.arriveTime.time = sne.getNowFormatDate(val.arriveTime.time);
							val.actionName = val.actionName ? val.actionName : "";
							return val;
						})
						_this.data = List;
					}
				}
			})
		},
		// 跳转抄送人员列表页面
		goCc: function(e) {
			_this.personType = e;
			sne.navigateTo({
				url: "./chaoSong.html",
				id: "chaoSong.html",
				data: {
					params: {
						pageType: "back"
					}
				}
			})
		},
		delCcPersion: function(e) {
			_this.saveParam.copyPerson.splice(e, 1);
		},
		// 参数校验
		checkParam: function() {
			if (!_this.saveParam.unit) {
				mui.alert("请选择适用机组");
				return false;
			} else if (!_this.saveParam.area) {
				mui.alert("请选择区域");
				return false;
			} else if (!_this.saveParam.unitID) {
				mui.alert("请选择被检查单位");
				return false;
			} else if (!_this.saveParam.nonconformity) {
				mui.alert("请选择隐患类型");
				return false;
			} else if (_this.saveParam.hiddenCategory === "") {
				mui.alert("请选择隐患属性");
				return false;
			} else if (!_this.saveParam.reqCompleteDate) {
				mui.alert("要求完成时间不能为空");
				return false;
			} else if (!_this.saveParam.hiddenDescription) {
				mui.alert("隐患描述不能为空");
				return false;
			} else if (!_this.saveParam.correctiveRequest) {
				mui.alert("整改措施要求不能为空");
				return false;
			} else if (!_this.saveParam.responsiblePerson) {
				mui.alert("责任整改人不能为空");
				return false;
			} else if (_this.saveParam.copyPerson.length < 1) {
				mui.alert("抄送人不能为空");
				return false;
			}
			return true;
		},
		// 删除图片
		closeImg: function() {
			_this.imgList = "";
			_this.imageList = "";
		},
        goCs: function() {
            sne.navigateTo({
            	url: "./chaoSong_1.html",
            	id: "chaoSong_1.html",
            	data: {
            		params: {
            			pageType: "back"
            		}
            	}
            })
        }
	}
})
