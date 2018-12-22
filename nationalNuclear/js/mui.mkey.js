/**!
 * Mkey插件 
 * @author	PCITLJN   <PCITLJN@qq.com>
 * @version v1.0.2 增加对非h5 plus的支持
 * @description 与MKey服务器进行交互，实现登录，transfer请求，附件预览，表单提交，文件下载，附件上传功能。
 * （附件预览依赖previewimage,zoom，请在页面中引入mui.previewimage.js + mui.zoom.js）
 * mui.mkey.login({username:u,password:p},callback [,showWaiting])
 * mui.mkey.get({url:u},callback [,showWaiting])
 * mui.mkey.post({url:u},callback [,showWaiting])
 * mui.mkey.submit(formid,callback [,showWaiting])
 * mui.mkey.viewfile({url:u} [,showWaiting])
 * mui.mkey.download({url:u},savepath,callback [,showWaiting])
 * mui.mkey.upload({url:u},callback [,showWaiting])
 */

(function($, window, document, undefined) {
	var t1 = new Date().getTime();
	var _waiting = null,
		_downloadTask = null,
		_waitingSetting = {
			//title: " 请稍等... ",
			autoShow: false,
			options: {
				size: "16px",
				padding: "15px",
				/*width:"120px",
				height:"120px",*/
				textalign: "center",
				padlock: true
			}
		};

	var Mkey = function() {
		this.config = {
			// url: "http://10.4.6.160:8080/http.do",//本地服务器
			// url: "http://10.4.210.110:8080/http.do",//测试服务器
			url: "http://10.4.210.112:8080/http.do",//测试服务器
			//url: "http://192.168.1.106:10000/http.do",
			bstransfer_action: "bs-transfer@mdp",
			viewfileremote_action: "viewfileremote@mdp",
			login_action: "login",
			default_cmd_name: "QRY",
			bstransfer_cmd_name: "QRY",
			polling_cmd_name: "POL",
			login_cmd_name: "USR",
			alt_cmd_name: "ALT",
			waitingSetting: _waitingSetting
		};
		this.client = {
			appid: "SNPYCCMDF",//"YMX74H",//
			appver: "1.0.0",
			mscver: "V4.0.0.BUILD.315.160120.150813",
			phonemodel: "Android|23|2.0|1.0|OPPO|OPPO R9s",
//			partnerid: "zwwx",
			screensize: '1080*1866',
			truescreensize: '1080*1920',
			imei: 'A0000063E9E353',
			imsi: '460036210280669',
			carrier: '46003',
			relogin: "false",
			autologin: "false",
			MSCID: "Android20",
			partnerid: 'DH',
			loginmode: 'background',
			vt: '4',
			lac: '',
			cellid: '',
			devicetoken: '',
			lac: '',
			encrypt: 'false'
		};
	};

	var proto = Mkey.prototype;

	proto.init = function(options, client) {
		//初始化需要做的事,获取分辨率、设备号等
		$.extend(this.config, options || {});
		$.extend(this.client, client || {});
		//console.log("mkey.init:"+JSON.stringify(client)+","+this.config.url);
	};

	proto.get = function(params, callback, showWaiting) {
		if(params['nologin']){
			params = $.extend(params,this.client)
		}
		_request.call(this, params, callback, showWaiting);
	};

	//dhmi的get方式请求
	proto.dhmi_get = function(params, callback, showWaiting) {
		//		console.log("没请请求的cookie信息"+plus.navigator.getCookie("http://210.14.74.86:8080/http.do"))
		params = $.extend({
			action: "query@mdpdhmi"
		}, params);
		_request.call(this, params, callback, showWaiting);
	};

	proto.post = function(params, callback, showWaiting) {
		this.get($.extend({
			method: "POST"
		}, params), callback, showWaiting);
	};

	proto.synpost = function(params, callback, showWaiting) {
		
		/*if(typeof showWaiting === "undefined") {
			showWaiting = true;
		}
		if(null === _waiting && showWaiting) {
			if($.os.plus) {
				_waiting = plus.nativeUI.showWaiting(_waitingSetting.title, _waitingSetting.options);
			} else if($(".weui_loading_toast").length > 0) {
				_waiting = $(".weui_loading_toast")[0];
				_waiting.classList.remove('mui-hidden');
			} else {
				_waiting = document.createElement('div');
				_waiting.classList.add('weui_loading_toast');
				_waiting.innerHTML = '<div class="weui_mask_transparent"></div><div class="weui_toast"><div class="weui_loading"><div class="weui_loading_leaf weui_loading_leaf_0"></div><div class="weui_loading_leaf weui_loading_leaf_1"></div><div class="weui_loading_leaf weui_loading_leaf_2"></div><div class="weui_loading_leaf weui_loading_leaf_3"></div><div class="weui_loading_leaf weui_loading_leaf_4"></div><div class="weui_loading_leaf weui_loading_leaf_5"></div><div class="weui_loading_leaf weui_loading_leaf_6"></div><div class="weui_loading_leaf weui_loading_leaf_7"></div><div class="weui_loading_leaf weui_loading_leaf_8"></div><div class="weui_loading_leaf weui_loading_leaf_9"></div><div class="weui_loading_leaf weui_loading_leaf_10"></div><div class="weui_loading_leaf weui_loading_leaf_11"></div></div><p class="weui_toast_content">请稍等...</p></div>';
				document.body.appendChild(_waiting);
			}
		}*/
		
		params = $.extend({
			action: this.config.bstransfer_action,
			_MSC_CMD_: this.config.bstransfer_cmd_name,
			phonemodel: this.client.phonemodel
		}, params);

		$.ajax(this.config.url, {
			data: params,
			async:false,//异步还是同步
			dataType: "xml",
			type: "POST",
			timeout: 60000,
			success: function(data) {
				//_closeWaiting();
				_handleBlankRequest(data, callback);
			},
			error: function(xhr, type, errorThrown) {
				if(xhr.status == 20403 || xhr.status == 463) {
					//需要重新登录，不用关闭等待框
					console.log("[" + xhr.status + "]客户端未登录");
					callback(20403);
				} else {
					_closeWaiting();
					console.error("异常：" + xhr.status + "," + type);
					//$.toast("无法连接服务器");
					callback(0);
				}
			}
		});
	};

	
	proto.alt = function(params, callback) {
		this.get($.extend({
			action: this.config.alt_cmd_name
		}, params), callback, false);
	};

	proto.pol = function(params, callback) {
		this.get($.extend({
			action: this.config.pol_cmd_name
		}, params), callback, false);
	};

	proto.login = function(params, callback, showWaiting) {
		var self = this;
		params = $.extend({
			action: this.config.login_action,
			_MSC_CMD_: this.config.login_cmd_name
		}, params);
		this.get($.extend(params, this.client), function(data) {
			var loginresult = data.getElementsByTagName("requestresult")[0].textContent;
			var msg = data.getElementsByTagName("msg")[0].textContent;
			console.log("mui.mkey.login:" + loginresult + "|" + msg + "|" + plus.navigator.getCookie(self.config.url));
			var Jsessionid = getCookie("JSESSIONID", plus.navigator.getCookie(self.config.url));
			//localStorage.setItem("CLIENTID",getCookie("CLIENTID",plus.navigator.getCookie(self.config.url)));
			//localStorage.setItem("JSESSIONID",getCookie("JSESSIONID",plus.navigator.getCookie(self.config.url)));
			//CLIENTID=SHGYTBEM4ff80808257e634a3015805ad83c30739; JSESSIONID=96F8CFF63622D35E0BA612E3E6A249B0
			console.log("服务端jsessionid的值为" + Jsessionid);
			if(loginresult == "0" || loginresult == "9908" || loginresult == "9907") {
				//成功登录之后设置cookie信息
				if(Jsessionid != null) {
					//					console.log("开始设置CLIENTSESSIONID");
					plus.navigator.setCookie(self.config.url, "CLIENTSESSIONID=" + Jsessionid);
					//					console.log("开始设置CLIENTSESSIONID完成"+Jsessionid);
				}
				callback(true, msg);
			} else {
				//登录失败
				callback(false, msg);
			}
		}, showWaiting);
	};

	proto.submit = function(formId, callback, showWaiting) {
		var form = document.getElementById(formId);
		console.log("[mui.mkey.submit]提交地址:" + form.action);
		this.post($.extend(_formToJSON(form), {
			url: form.action
		}), callback, showWaiting);
		//将表单的控件转成json数据
		function _formToJSON(form) {
			var json = '{',
				name;
			isarray = false;
			for(i = 0, max = form.elements.length; i < max; i++) {
				e = form.elements[i];
				name = e.name;
				if(name) {
					if(name.substring(name.length - 2) == '[]') {
						name = name.substring(0, name.length - 2);
						lastarr = name;
						if(isarray == false) {
							json += '"' + name + '":[';
						}
						isarray = true;
					} else {
						if(isarray) {
							json = json.substring(0, json.length - 1) + '],';
						}
						isarray = false;
					} //end else
					switch(e.type) {
						case 'checkbox':
						case 'radio':
							if(!e.checked) {
								break;
							}
						case 'hidden':
						case 'password':
						case 'file':
						case 'textarea':
						case 'text':
							if(!isarray) {
								json += '"' + name + '":';
							}
							json += '"' + e.value.replace(new RegExp('(["\\\\])', 'g'), '\\$1').replace(new RegExp('[\n\r\n]', 'g'), '_brHH_') + '",';
							break;

						case 'button':
						case 'image':
						case 'reset':
						case 'submit':
						default:
					} //end switch
				}
			}; //end for
			if(json != "{") {
				//提交isMUI参数，MKEY上行模板中需要处理一下换行符
				return JSON.parse(json + '"isMUI":"true"}');
				//return JSON.parse(json.substring(0, json.length - 1) + '}');
			} else {
				return {};
			}
		}
	};

	proto.viewfile = function(params, callback, showWaiting) {
		var self = this;
		this.get($.extend({
			action: this.config.viewfileremote_action
		}, params), viewFileCallback, showWaiting);
		//服务器返回了数据
		function viewFileCallback(response) {
			if(response.getElementsByTagName("image").length) {
				var imageurls = [],
					imageHtml = "";
				var images = response.getElementsByTagName("image");
				//var imageContexts = document.getElementById("imageContext");
				
				for(var i = 0; i < images.length; i++) {
					//console.log(i+"========"+images[i].getAttribute("src"))
					imageurls[imageurls.length] = mui.mkey.config.url + images[i].getAttribute("src") + "&_MSC_CMD_=QRY";
					imageHtml += '<img width="100%" src="" id="viewimg' + i + '" data-preview-src="'+ imageurls[imageurls.length - 1] +'" data-preview-group="1" />';
				}
				//imageContexts.innerHTML = imageHtml;
				//console.log("========"+imageHtml)
				if(!document.getElementById('__container')) {
					var newNode = document.createElement("div");
					newNode.id = "__viewFileDiv";
					newNode.innerHTML = "<div id='__container' style='width:100%;height:100%;position:absolute;top:0;left:0;background:#ffffff;display:none;'>" + imageHtml + "</div>";
					document.body.appendChild(newNode.firstChild);
				} else {
					document.getElementById("__container").innerHTML = imageHtml;
				}
				var previewImage = $.previewImage();
				previewImage.open(document.getElementById('viewimg0'));
			} else if(response.getElementsByTagName("table").length > 0) {
				//$.toast("Excel");
				callback(self.xmlToString(response));
			} else if(response.getElementsByTagName("msg").length > 0) {
				console.log(self.xmlToString(response));
			}
		}
	};


	proto.download = function(filename, params, callback, showWaiting) {
		// TO DO 怎样避免重复创建等优化
		if(_downloadTask) {
			//_downloadTask.clear();
		}
		_downloadTask = plus.downloader.createDownload(filename, params,
			function(d, status) {
				console.log("status===="+status);
				if(status === 200) {
					console.log("下载成功!" + d.filename);
					plus.downloader.clear(d.state);
					callback(true, d);
				} else {
					d.abort();
					console.log("下载失败!" + d.filename);
					callback(false, d);
				}
			});
		_downloadTask.start();
	};

	proto.upload = function(files, params, callback, showWaiting) {
		if(files.length <= 0) {
			$.toast("没有需要上传的文件！");
			return;
		}
		if(typeof showWaiting === "undefined") {
			showWaiting = true;
		}
		var task = plus.uploader.createUpload(mui.mkey.config.url, {
				method: "POST"
			},
			function(t, status) { //上传完成
				_closeWaiting();
				callback(t, status);
			}
		);

		for(var p in params) {
			task.addData(p, params[p]);
		}
		for(var i = 0; i < files.length; i++) {
			var f = files[i];
			task.addFile(f.path, {
				key: f.name
			});
		}
		if(null === _waiting && showWaiting) {
			_waiting = plus.nativeUI.showWaiting("正在上传", _waitingSetting.options);
			_waiting.onclose = function(task) {
				//console.log("取消上传");
				if(task) {
					task.abort();
				}
			};
		}
		task.start();
	};

	//xmlToString,stringToXml这两个方法没在这个插件用到，可以移到cgnpc.js
	proto.xmlToString = function(data) {
		if(!data) {
			return null;
		}
		var result;
		try {
			result = (new XMLSerializer()).serializeToString(data);
		} catch(e) {
			console.log("xml转换string异常!");
			result = null;
		}
		return result;
	};

	proto.stringToXml = function(data) {
		if(typeof data != "string" || !data) {
			return null;
		}
		var result;
		try {
			result = new DOMParser().parseFromString(data, "text/xml");
		} catch(e) {
			console.log("string转换xml异常!");
			result = null;
		}
		return result;
	};

	//所有的请求应该以此为模板
	//虽然可以用函数表达试写：var _request = function(){}，
	//但是这样写的话调用之前需要先定义，需要放到这个作用域的最上面
	function _request(params, callback, showWaiting) {
		var self = this,
			loadingNode = null;

		params = $.extend({
			action: this.config.bstransfer_action,
			_MSC_CMD_: this.config.bstransfer_cmd_name,
			phonemodel: this.client.phonemodel
		}, params);
		_blankRequest.call(this, params, function(data) {
			console.log(data);
			if(data === 20403) {
				if(localStorage.getItem("yhm")) {
					console.log("正在重登录...");
					var b = new Base64();
					var mm = b.decode(localStorage.getItem("mm"));
					self.login({
						username: localStorage.getItem("yhm"),
						password: mm,
						m: "login@sso",
						relogin: "true"
					}, function(result, msg) {
						if(result) {
							console.log("重登录完成，继续上次的请求..." + params.url);
							_blankRequest.call(self, params, callback, showWaiting);
						} else {
							//TO DO 重新登录失败，只好退出应用，或者重新登录了。
							console.log("重登录失败，重启应用");
							plus.nativeUI.closeWaiting();
							_restart();
						}
					}, showWaiting);
				} else {
					//TO DO 需要进行重登录，但是没有帐号信息，只好退出应用，或者重新登录了。
					$.toast("请重新登录后再操作");
					plus.nativeUI.closeWaiting();
					console.log("需要重新登录，但没用户信息");
					_restart();
				}
			} else if(data === 0) {
				if(plus.os.name == "iOS"){
					$.toast("请重新登录后再操作");
					plus.nativeUI.closeWaiting();
					_restart();
				}else{
					$.toast("当前无可用网络，请重新加载。");
					plus.nativeUI.closeWaiting();
				}
				//				loadingNode = document.getElementById("loading");
				//				if(loadingNode){hidden
				//					loadingNode.classList.remove("mui-");
				//					if ($.os.plus && plus.networkinfo.getCurrentType() == plus.networkinfo.CONNECTION_NONE) {
				//						loadingNode.innerHTML = "当前无可用网络，点击重新加载。";
				//					} else{
				//						loadingNode.innerHTML = "当前网络不稳定，点击重新加载。";
				//					}
				//					loadingNode.addEventListener("tap", reLoad, false);
				//				}
			} else {
				callback(data);
			}
		}, showWaiting);

		function reLoad() {
			loadingNode.innerHTML = "正在加载...";
			setTimeout(function() {
				_request.call(self, params, callback, showWaiting);
			}, 200);
			loadingNode.removeEventListener("tap", reLoad);
			loadingNode = null;
		}
	};

	//这里才发出请求
	function _blankRequest(params, callback, showWaiting) {
		var self = this;

		if(typeof showWaiting === "undefined") {
			showWaiting = true;
		}
		if(null === _waiting && showWaiting) {
			if($.os.plus) {
				_waiting = plus.nativeUI.showWaiting(_waitingSetting.title, _waitingSetting.options);
			} else if($(".weui_loading_toast").length > 0) {
				_waiting = $(".weui_loading_toast")[0];
				_waiting.classList.remove('mui-hidden');
			} else {
				_waiting = document.createElement('div');
				_waiting.classList.add('weui_loading_toast');
				_waiting.innerHTML = '<div class="weui_mask_transparent"></div><div class="weui_toast"><div class="weui_loading"><div class="weui_loading_leaf weui_loading_leaf_0"></div><div class="weui_loading_leaf weui_loading_leaf_1"></div><div class="weui_loading_leaf weui_loading_leaf_2"></div><div class="weui_loading_leaf weui_loading_leaf_3"></div><div class="weui_loading_leaf weui_loading_leaf_4"></div><div class="weui_loading_leaf weui_loading_leaf_5"></div><div class="weui_loading_leaf weui_loading_leaf_6"></div><div class="weui_loading_leaf weui_loading_leaf_7"></div><div class="weui_loading_leaf weui_loading_leaf_8"></div><div class="weui_loading_leaf weui_loading_leaf_9"></div><div class="weui_loading_leaf weui_loading_leaf_10"></div><div class="weui_loading_leaf weui_loading_leaf_11"></div></div><p class="weui_toast_content">请稍等...</p></div>';
				document.body.appendChild(_waiting);
			}
		}
		//异步请求，暂时切换成xhr方式请求
		$.ajax(this.config.url, {
			data: params,
			dataType: "xml",
			type: "POST",
			timeout: 60000,
			success: function(data) {
				_closeWaiting();
				_handleBlankRequest(data, callback);
			},
			error: function(xhr, type, errorThrown) {
				if(xhr.status == 20403 || xhr.status == 463) {
					//需要重新登录，不用关闭等待框
					console.log("[" + xhr.status + "]客户端未登录");
					callback(20403);
				} else {
					_closeWaiting();
					console.error("异常：" + xhr.status + "," + type);
					//$.toast("无法连接服务器");
					callback(0);
				}
			}
		});
//		var xhr = new plus.net.XMLHttpRequest();
//		xhr.onreadystatechange = function () {
//			switch ( xhr.readyState ) {
//				case 0:
//					alert( "xhr请求已初始化" );
//				break;
//				case 1:
//					alert( "xhr请求已打开" );
//				break;
//				case 2:
//					alert( "xhr请求已发送" );
//				break;
//				case 3:
//					alert( "xhr请求已响应");
//					break;
//				case 4:
//					if ( xhr.status == 200 ) {
//						alert( "xhr请求成功："+xhr.responseText );
//					} else {
//						alert( "xhr请求失败："+xhr.readyState );
//					}
//					break;
//				default :
//					break;
//			}
//		}
//		xhr.open( "GET", this.config.url);
//		xhr.send(params);

	};

	//收到服务器响应之后先处理一些不正常的响应，比如账号在其它地方登录等情况
	function _handleBlankRequest(data, callback) {
		if(data == null || data == "null") {
			$.toast("当前无可用网络，请重新加载。");
			return;
		}

		var msc = data.getElementsByTagName("msc");
		if(msc && "servermsg" == msc[0].getAttribute("type")) {
			var msgshow = data.getElementsByTagName('msg')[0].getAttribute('show');
			var msgcontent = data.getElementsByTagName('msg')[0].textContent;
			var dataStr = xmlToString(data);
			if(msgcontent.indexOf('其它地方') > -1) {
//				alert(msgcontent);
				$.toast(msgcontent);
				setTimeout(_restart, 1500);
				return;
			} else if(dataStr.indexOf('与其他账号绑定') > -1) {
				$.toast("当前设备已被其它账号绑定！");
			} else if(dataStr.indexOf('绑定错误') > -1) {
				$.toast("当前账号绑定数量已到上线！");
			} else if(msgshow == 'true' && msgcontent != "") {
				//限制密码登录次数，超过上限，登录将被禁止5分钟
				if(msgcontent.indexOf("错误的用户名密码")>-1){
					if(errorLoginTime == 0){//第一次错误，初始化登录时间，错误次数+1
						errorLoginTime = getTime();//获取登录时间
						errorNumLogin ++;
						localStorage.setItem("errorLoginTime",errorLoginTime);//获取登录时间
						localStorage.setItem("errorNumLogin",errorNumLogin);
					}else{
						//不是第一次登录，如果当前错误时间减去上一次错误时间，大于1分钟，从0开始计数
						if(parseInt(getTime())-parseInt(localStorage.getItem("errorLoginTime"))>1*60*1000){
							errorLoginTime = getTime();//错误时间
							errorNumLogin = 1;//间隔时间超过1分钟，此处错误次数从1计算
							localStorage.setItem("errorLoginTime",errorLoginTime);//获取登录时间
							localStorage.setItem("errorNumLogin",errorNumLogin);
						}else{
							errorLoginTime = getTime();//错误时间
							errorNumLogin ++;
							localStorage.setItem("errorLoginTime",getTime());//获取登录时间
							localStorage.setItem("errorNumLogin",errorNumLogin);
							if(errorNumLogin == 10){
								errorNumLogin = 0;
								errorLoginTime = 0;	
								localStorage.setItem("errorLoginTime",0);//获取登录时间
								localStorage.setItem("errorNumLogin",0);
								localStorage.setItem("isLock","1");
								mui.alert(errorLoginToast1);
							}else{
								if(errorNumLogin == 9){//等于2次时给予提示，是否继续登录
									mui.alert(errorLoginToast2);
								}
							}
						}
					}
					//第一版本，控制登录错误次数超过3次，禁止登录5分钟的
					/*errorNumLogin ++;
					if(errorNumLogin == 3){//错误次数上限了，禁止登录
						mui.alert(errorLoginToast1);
						localStorage.setItem("disabledTime",getTime());
						disableLogin();
						countTime(5*60*1000);//倒计时5分钟
					}else{
						if(errorNumLogin == 2){//等于2次时给予提示，是否继续登录
							mui.alert(errorLoginToast2);
						}
					}*/
				}else{//除了密码错误情况，其他情况，计数归0
					errorNumLogin = 0;
					errorLoginTime = 0;	
					localStorage.setItem("errorLoginTime",0);//获取登录时间
					localStorage.setItem("errorNumLogin",0);
					//localStorage.removeItem("disabledTime");
				}
				$.toast(msgcontent);
				plus.nativeUI.closeWaiting();
				return;
			}
		}
		callback(data);
	}

	//xml转换为String类型
	function xmlToString(data) {
		if(!data) {
			return null;
		}
		var result;
		try {
			result = (new XMLSerializer()).serializeToString(data);
		} catch(e) {
			console.log("xml转换string异常!");
			result = null;
		}
		return result;
	}

	function _restart() {
		if(typeof(com) !== "undefined") {
			com.dheaven.msc.window.executeDHSAsync("autologin", "goLogin");
		} else if($.os.plus) {
			plus.runtime.restart();
//			if(plus.os.name == "Android") {
//				plus.runtime.quit();
////				window.location.href = "../login.html";
//			} else {
//				plus.runtime.restart();
//			}
		}else{
			plus.runtime.restart();
		}
		//		else{
		//			window.location.href = "/CGN/login_zt/login.html";
		//		}
	}

	function _closeWaiting() {
		if(null != _waiting) {
			if(_waiting.close) {
				_waiting.close();
			}
			//			else{
			//				//document.body.removeChild(_waiting);
			//				_waiting.classList.add('mui-hidden');
			//			}
		}
		_waiting = null;
	}

	//相关cookie操作
	function getCookie(name, cookies) {
		var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
		if(arr = cookies.match(reg))
			return arr[2];
		else
			return null;
	}

	//mkey是单例的，只需要创建一次
	var mkeyApi = null;
	$.mkey = (function() {
		if(!mkeyApi) {
			mkeyApi = new Mkey();
		}
		return mkeyApi;
	})();

	//自动初始化
	$.ready(function() {

	});

	$.plusReady(function() {
		var mkey_url = localStorage.getItem("mkey_url");
		var client_info = localStorage.getItem("client_info");

		var mkeyObj = mkey_url ? {
			url: mkey_url
		} : {};
		var clientObj = client_info ? JSON.parse(client_info) : {};
		$.mkey.init(mkeyObj, clientObj);
	});

	//$.toast("mui.mkey加载时间：" + (new Date().getTime() - t1) + "ms");
	function Base64() {

		// private property
		_keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

		// public method for encoding
		this.encode = function(input) {
			var output = "";
			var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
			var i = 0;
			input = _utf8_encode(input);
			while(i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if(isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else if(isNaN(chr3)) {
					enc4 = 64;
				}
				output = output +
					_keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
					_keyStr.charAt(enc3) + _keyStr.charAt(enc4);
			}
			return output;
		}

		// public method for decoding
		this.decode = function(input) {
			var output = "";
			var chr1, chr2, chr3;
			var enc1, enc2, enc3, enc4;
			var i = 0;
			input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
			while(i < input.length) {
				enc1 = _keyStr.indexOf(input.charAt(i++));
				enc2 = _keyStr.indexOf(input.charAt(i++));
				enc3 = _keyStr.indexOf(input.charAt(i++));
				enc4 = _keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output = output + String.fromCharCode(chr1);
				if(enc3 != 64) {
					output = output + String.fromCharCode(chr2);
				}
				if(enc4 != 64) {
					output = output + String.fromCharCode(chr3);
				}
			}
			output = _utf8_decode(output);
			return output;
		}

		// private method for UTF-8 encoding
		_utf8_encode = function(string) {
			string = string.replace(/\r\n/g, "\n");
			var utftext = "";
			for(var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if(c < 128) {
					utftext += String.fromCharCode(c);
				} else if((c > 127) && (c < 2048)) {
					utftext += String.fromCharCode((c >> 6) | 192);
					utftext += String.fromCharCode((c & 63) | 128);
				} else {
					utftext += String.fromCharCode((c >> 12) | 224);
					utftext += String.fromCharCode(((c >> 6) & 63) | 128);
					utftext += String.fromCharCode((c & 63) | 128);
				}

			}
			return utftext;
		}

		// private method for UTF-8 decoding
		_utf8_decode = function(utftext) {
			var string = "";
			var i = 0;
			var c = c1 = c2 = 0;
			while(i < utftext.length) {
				c = utftext.charCodeAt(i);
				if(c < 128) {
					string += String.fromCharCode(c);
					i++;
				} else if((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i + 1);
					string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
					i += 2;
				} else {
					c2 = utftext.charCodeAt(i + 1);
					c3 = utftext.charCodeAt(i + 2);
					string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
					i += 3;
				}
			}
			return string;
		}
	}
})(mui, window, document);

//带有图片信息的预览
function viewFileCallbackimg(imgurl){
	var imageurl = mui.mkey.config.url + imgurl + "&_MSC_CMD_=QRY";
	var imageHtml = '<img width="100%" src="../img/none.png" id="viewimg0" data-preview-src="' + imageurl + '" data-preview-src_="" data-preview-group="viewfiles" />';
	if (!document.getElementById('__container')) {
		var newNode = document.createElement("div");
		newNode.id = "__viewFileDiv";
		newNode.innerHTML = "<div id='__container' style='width:100%;height:100%;position:absolute;top:0;left:0;background:#ffffff;display:none;'>" + imageHtml + "</div>";
		document.body.appendChild(newNode.firstChild);
	} else {
		document.getElementById("__container").innerHTML = imageHtml;
	}
	var previewImage = mui.previewImage();
	previewImage.open(document.getElementById('viewimg0'));
}