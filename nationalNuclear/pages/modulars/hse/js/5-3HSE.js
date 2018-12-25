var _this = this;
new Vue({
    el: "#app",
    data: {
        imgList: "",    // 附件
        showImg: false,
        prevParam: {},  // 上个页面过来的参数
        saveParam: {    // 新建保存和提交传的参数
        	"projNo": "", // 项目
        	"checkDate": "", // 检查日期
        	"checkPerson": "", // 检查人
        	"checkForm": "0",    // 检查形式
        	"draftUnit": "",   // 编制单位
        	"draftDept": "",   // 编制部门
        	"draftPerson": "", //编制人
        	"draftDate": "",   //编制日期
        	"recordType":"0",   // 业主联队检查单类型(后期更改)
        	"userId":"", //用户ID
        	"userName":"",    // 用户名称
        	"unit": "",  // 机组
        	"area": "",    // 区域
        	"unitID": "",   // 被检查单位
        	"hseHiddenLevel": "0",   // 隐患级别 一般0 重大1
        	"hiddenCategory": "",   // 隐患属性
        	"nonconformity": "",    // 隐患类型
        	"reqCompleteDate": "", // 要求完成时间
        	"hiddenDescription": "", // 隐患描述
        	"correctiveRequest": "",   // 整改措施要求
        	"contractonPeople": "0", // 整改单编制人(后期修改)
        	"responsiblePerson": "",    // 责任整改人
        	"responsiblePersonId": "", // 责任整改人ID  
        	"copyPerson": [], // 抄送
        	"state":"",    // 保存0或提交1
        	"hiddenDoc": ""
        },
        responsiblePersonList: [
// 					{
//         	text: "潘金鑫",
//         	value: "PJX",
//         },{
//         	text: "徐童",
//         	value: "XT",
//         },{
//         	text: "易邦金",
//         	value: "YBJ",
//         },{
//         	text: "侯瑞强",
//         	value: "HRQ",
//         },
				],
//         unitList: [{
//         	"uniteEnglishDesc": "State Nuclear Power PWR Demonstration Project Unit 1",
//         	"unitDesc": "国核示范1号机组",
//         	"projectsByArea": "SNG",
//         	"text": "国核示范1号机组1",
//         	"value": "SN1"
//         }, {
//         	"uniteEnglishDesc": "State Nuclear Power PWR Demonstration Project Unit 2",
//         	"unitDesc": "国核示范2号机组",
//         	"projectsByArea": "SNG",
//         	"text": "国核示范2号机组1",
//         	"value": "SN2"
//         }, {
//         	"uniteEnglishDesc": "State Nuclear Power PWR Demonstration Project Phase I and Units 1&amp;2",
//         	"unitDesc": "国核示范1/2号机组共用",
//         	"projectsByArea": "SNG",
//         	"text": "国核示范1/2号机组共用1",
//         	"value": "SNG"
//         }],
				unitList:[],
        areaList: [
// 					{
//         	"value": "1",
//         	"text": "核岛"
//         }, {
//         	"value": "1.1",
//         	"text": "核岛-1厂房"
//         }, {
//         	"value": "1.2",
//         	"text": "核岛-2厂房"
//         }, {
//         	"value": "1.3",
//         	"text": "核岛-3厂房"
//         },
				],
        unitIDList: [
// 					{
//         	"organizeCode": "SNG",
//         	"projectsByArea": "SNG",
//         	"value": "SNG",
//         	"text": "示范电站/石岛湾项目部"
//         }, {
//         	"organizeCode": "NNICA-SNG",
//         	"projectsByArea": "SNG",
//         	"value": "NNICA-SNG",
//         	"text": "示范电站/石岛湾-华兴"
//         }, {
//         	"organizeCode": "NNEC-SNG",
//         	"projectsByArea": "SNG",
//         	"value": "NNEC-SNG",
//         	"text": "示范电站/石岛湾-中核二三"
//         }, {
//         	"organizeCode": "NZHD-SNG",
//         	"projectsByArea": "SNG",
//         	"value": "NZHD-SNG",
//         	"text": "示范电站/石岛湾-浙江火电"
//         },
				],
        nonconformityList: [
// 					{
//         	"hazardTypeSeriar": "1",
//         	"hazardTypeDesc": "32",
//         	"value": "1",
//         	"text": "23"
//         }, {
//         	"hazardTypeSeriar": "2",
//         	"hazardTypeDesc": "3232",
//         	"value": "2",
//         	"text": "13"
//         }, {
//         	"hazardTypeSeriar": "1",
//         	"hazardTypeDesc": "32",
//         	"value": "3",
//         	"text": "15"
//         },
				],
        hiddenCategoryList: [{
        	value: "0",
        	text: "管理缺陷"
        },{
        	value: "1",
        	text: "人的不安全行为"
        },{
        	value: "2",
        	text: "物的不安全状态"
        },{
        	value: "3",
        	text: "环境的不安全因素"
        }],
        copyPersonList: [
// 					{
//         	"value": "ZHANGDESHENG",
//         	"text": "张德生"
//         }, {
//         	"value": "ZHANGYONG8",
//         	"text": "张勇2"
//         }, {
//         	"value": "ZHANGQIMING",
//         	"text": "张奇明"
//         }, {
//         	"value": "ZHANGBAOLIANG",
//         	"text": "张保良"
//         }, {
//         	"value": "ZHANGSHAOWEI",
//         	"text": "张韶伟"
//         }, {
//         	"value": "ZHANGXINKE", 
//         	"text": "张新科"
//         }, {
//         	"value": "ZHANGYAN1",
//         	"text": "张衍"
//         }, {
//         	"value": "ZHANGXIAOFEI1",
//         	"text": "张晓斐"
//         }, {
//         	"value": "ZHANGXIAOFEI",
//         	"text": "张晓斐"
//         },
				]
    },
    mounted: function() {
        _this = this;
		function plusReady() {
            _this.prevParam = plus.webview.currentWebview().params;
            _this.init();
						_this.getUnit();
						_this.getArea();
						_this.getInspectedUnit();
						_this.getHazardTypeList();
						_this.getCopyPerson();
		}
		if(window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
    },
    methods: {
        // 初始化
        init: function() {
            _this.saveParam.userId = app.loginInfo.userId;
            _this.saveParam.userName = app.loginInfo.userName;
            _this.saveParam.projNo = app.loginInfo.projNo;
            _this.saveParam.draftUnit = app.loginInfo.draftUnit;
            _this.saveParam.draftDept = app.loginInfo.draftDept;
            _this.saveParam.draftPerson = app.loginInfo.userName;
            _this.saveParam.draftDate = sne.getNowFormatDate().substr(0,10);
            if(_this.prevParam.type == "new") {
                var date = sne.getNowFormatDate();
                _this.saveParam.checkDate = date.substr(0,10);
                _this.saveParam.checkPerson = app.loginInfo.userName;
                _this.saveParam.reqCompleteDate = date.substr(0,10);
            } else {
                _this.getDetail();
            }
        },
				//获取机组
				getUnit:function(){
					var param ={
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
				getArea:function(){
					var param ={
						"projNo":app.loginInfo.projNo,
					}
					app.ajax({
							url: app.INTERFACE.getArea,
							data: param,
							success: function(res) {
								var List = res.beans.map((val, index) => {
									val.text = val.childZonoName;
									val.value = val.childZonoId;
									return val;
								})
								_this.areaList = List;
							}
					})
				},
				//获取被检查单位
				getInspectedUnit:function(){
					var param ={
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
				getHazardTypeList:function(){
					var param ={
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
				//获取抄送人列表
				getCopyPerson:function(){
					var param ={
						"projNo": app.loginInfo.projNo,
						// "userName": app.loginInfo.userName
						"userName": ""
					}
					app.ajax({
							url: app.INTERFACE.getCopyPerson,
							data: param,
							success: function(res) {
								var List = res.beans.map((val, index) => {
									val.text = val.memberName;
									val.value = val.memberId;
									return val;
								})
								_this.copyPersonList = List;//抄送人
								_this.responsiblePersonList = List;//整改人
							}
					})
				},
				//语音输入
				openVoice:function(e){
					console.log(e== 0)
					var options = {};
					options.engine = 'iFly';
					// alert("开始语音识别：");
					plus.speech.startRecognize(options, function(s) {
						if(e == 0){
							_this.saveParam.hiddenDescription += s.split("。")[0];
						}else{
							_this.saveParam.correctiveRequest += s.split("。")[0];
						}
					}, function(e) {
						mui.toast("语音识别失败：" + e.message);
					});
				},
        // 日期选择
        checkDate: function(e) {
            console.log(e)
            var options = {"type":"date","beginYear":2014,"endYear":2025};
            var picker = new mui.DtPicker(options);
            picker.show(function(rs) {
            	_this.saveParam[e] = rs.text;
            });
        },
        // 选择器
        showPicker: function(e) {
            var userPicker = new mui.PopPicker(); 
            var list = e+"List";
            userPicker.setData(_this[e+"List"]);
            userPicker.show(function(items) {
                if(e == "copyPerson") {
                    _this.saveParam[e].push({
                        id: items[0].value,
                        name: items[0].text
                    })
                } else {
                    _this.saveParam[e] = items[0].text;
                }
                if(e == "responsiblePerson") {
                    _this.saveParam.responsiblePersonId = items[0].value;
                }
            });
        },
        // 附件上传
        fileUpLoad: function() {
            if(_this.imgList.length > 1) {
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
            plus.gallery.pick(function(path) {
            	_this.appendFile(path); //处理图片的地方
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
        upload: function(base64) {
            
        },
        // 提交或保存
        submit: function(e) {   // 0保存 1提交
            this.saveParam.state = e;
            _this.saveParam.hiddenDoc = _this.imgList;
          
            
            if(_this.saveParam.hiddenCategory == "管理缺陷") {
                _this.saveParam.hiddenCategory = 0
            } else if(_this.saveParam.hiddenCategory == "人的不安全行为") {
                _this.saveParam.hiddenCategory = 1

            } else if(_this.saveParam.hiddenCategory == "物的不安全状态") {
                _this.saveParam.hiddenCategory = 2

            } else if(_this.saveParam.hiddenCategory == "环境的不安全因素") {
                _this.saveParam.hiddenCategory = 3

            }
            var method = "";
            if(this.prevParam.type == "list") { // 从草稿过来，调取不同接口；
            	this.saveParam.dangerId = this.prevParam.dangerId;
            	this.saveParam.checkId = this.prevParam.checkId;
                
            	if(e == 0) {
            		method = app.INTERFACE.draftsSave
            	} else {
            		method = app.INTERFACE.draftsSubmit
            	}
            } else {
            	method = app.INTERFACE.insertCheck
            };
            app.ajax({
                url: method,
                data: _this.saveParam,
                success: function(res) {
                    if(res.object.resultCode == 0) {
                        mui.toast(e == 0 ? "保存成功" : "提交成功");
                        mui.back();
                    }
                }
            })
        },
        getDetail: function() {
            _this.saveParam.checkDate = _this.prevParam.checkDate;
            _this.saveParam.checkPerson = _this.prevParam.checkPerson;
           
            app.ajax({
                url: app.INTERFACE.selectDanger,
                data: {
                    checkId: _this.prevParam.checkId
                },
                success: function(res) {
                    var dangerList = res.object.dangerList;
                    _this.saveParam.unit = dangerList.unit;
                    _this.saveParam.area = dangerList.area;
                    _this.saveParam.unitID = dangerList.unitid;
                    _this.saveParam.nonconformity = dangerList.nonconformity;
                    _this.saveParam.hiddenCategory = dangerList.hiddencategory;
                    _this.saveParam.reqCompleteDate = dangerList.reqcompletedate.substr(0,10);
                    _this.saveParam.hseHiddenLevel = dangerList.hsehiddenlevel;
                    _this.saveParam.hiddenDescription = dangerList.hiddendescription;
                    _this.saveParam.correctiveRequest = dangerList.correctiverequest;
                    _this.saveParam.responsiblePerson = dangerList.responsibleperson;
                    _this.saveParam.responsiblePersonId = dangerList.responsiblepersonid;
                    _this.saveParam.copyPerson = JSON.parse(dangerList.copyPerson);
                }
            })
        }
    }
})