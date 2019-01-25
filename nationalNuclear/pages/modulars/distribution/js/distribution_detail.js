var _this = null;

new Vue({
	el: "#app",
	data: {
		mainFlag: true, //主文件是否显示状态控制
		relateFlag: true, //关联文件是否显示状态控制
		submitFlag: true, //提交按钮是否显示状态控制
		// acceptFlag:true,//接受按钮是否显示状态控制
		delegateFlag: true, //委派按钮是否显示状态控制
		// repeatFlag:true,//重复按钮是否显示状态控制
		rejectFlag: true, //回退按钮是否显示状态控制
		listParam: {}, // 列表数据
		baseInfo: { //基本信息
			"procName": "",
			"taskName": "",
			"taskSubject": ""
		},
		mainFiles: [], //主文件
		relateFiles: [], //关联文件
		processInfo: [], //流程日志
		suggesting: "", //办理意见
	},
	mounted: function() {
		_this = this;

		function plusReady() {
			_this.listParam = plus.webview.currentWebview().item;
			console.log(JSON.stringify(_this.listParam))
			_this.requestData();
			_this.processData();
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
				"action": {
					"taskId": _this.listParam.taskId,
					"actionCode": "MWS_TASKINFO"
				}
			};
			sne.xmlAjax(sne.json2xml(param), function(res) {
				// console.log(sne.xml2json(sne.xmlToString(res)))
				var jsonText = sne.xml2json(sne.xmlToString(res));
				var json = JSON.parse(jsonText);
				console.log(JSON.stringify(json))
				if (json.message.returnCode == 0) {
					_this.baseInfo.procName = json.message.returnValue.procName;
					_this.baseInfo.taskName = json.message.returnValue.taskName;
					_this.baseInfo.taskSubject = json.message.returnValue.taskSubject;
				}
				if (json.message.returnValue.mainFiles != undefined) {
					_this.mainFlag = true;
					if (Array.isArray(json.message.returnValue.mainFiles)) {
						_this.mainFiles = json.message.returnValue.mainFiles;
					} else {
						var arr = [];
						arr.push(json.message.returnValue.mainFiles.item);
						_this.mainFiles = arr;
					}
				} else {
					_this.mainFlag = false;
				}
				if (json.message.returnValue.relateFiles != undefined) {
					_this.relateFlag = true;
					if (Array.isArray(json.message.returnValue.relateFiles)) {
						_this.relateFiles = json.message.returnValue.relateFiles;
					} else {
						var arr = [];
						arr.push(json.message.returnValue.relateFiles.item);
						_this.relateFiles = arr;
					}
				} else {
					_this.relateFlag = false;
				}
				_this.submitFlag = json.message.returnValue.processingButton.submit == "true" ? true : false;
				// _this.acceptFlag = json.message.returnValue.processingButton.accept == "true"?true:false;
				_this.delegateFlag = json.message.returnValue.processingButton.delegate == "true" ? true : false;
				// _this.repeatFlag = json.message.returnValue.processingButton.repeat == "true"?true:false;
				_this.rejectFlag = json.message.returnValue.processingButton.reject == "true" ? true : false;
			}, function(xhr, type, errorThrown) {

			});
		},
		//流程日志信息
		processData: function() {
			var param = {
				"action": {
					"taskId": _this.listParam.taskId,
					"actionCode": "MWS_WORKFLOWLOG"
				}
			};
			sne.xmlAjax(sne.json2xml(param), function(res) {
				// console.log(sne.xml2json(sne.xmlToString(res)))
				var jsonText = sne.xml2json(sne.xmlToString(res).replace(/\n/g, ""));
				var json = JSON.parse(jsonText);
				console.log(JSON.stringify(json))
				if (Array.isArray(json.message.returnValue.item)) {
					_this.processInfo = json.message.returnValue.item;
				} else {
					var arr = [];
					arr.push(json.message.returnValue.item);
					_this.processInfo = arr;
				}
			}, function(xhr, type, errorThrown) {

			});
		},
		//语音输入
		openVoice: function(e) {
			var options = {};
			options.engine = 'iFly';
			// alert("开始语音识别：");
			plus.speech.startRecognize(options, function(s) {
				_this.suggesting += s;
			}, function(e) {
				mui.toast("语音识别失败：" + e.message);
			});
		},
		//回退
		reject: function() {
			var param = {
				"action": {
					"actionCode": "MWS_REJECT",
					"taskId": _this.listParam.taskId,
					"comment": _this.suggesting
				}
			}
			sne.xmlAjax(sne.json2xml(param), function(res) {
				// console.log(sne.xml2json(sne.xmlToString(res)))
				var jsonText = sne.xml2json(sne.xmlToString(res).replace(/\n/g, ""));
				var json = JSON.parse(jsonText);
				console.log(JSON.stringify(json))
				if (Array.isArray(json.message.returnValue.item)) {
					_this.processInfo = json.message.returnValue.item;
				} else {
					var arr = [];
					arr.push(json.message.returnValue.item);
					_this.processInfo = arr;
				}
			}, function(xhr, type, errorThrown) {
			
			});
		},
        
        // 委派
        delegate: function() {
            sne.navigateTo({
                url: "./person.html",
                id: "person.html"
            })
        }
	}
})
