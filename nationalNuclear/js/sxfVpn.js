document.addEventListener( "plusready",  function()
{
    var _BARCODE = 'sxfVpn',
		B = window.plus.bridge;
    var sxfVpn = 
    {
    	// vpnMode 1 easyApp 2 L3VPN
    	// serverAddress 服务器地址
    	// port 服务器端口
    	// 成功回调
    	// 失败回调
    	sxfVpnInit : function (vpnMode, serverAddress,successCallback, errorCallback )
		{
			var success = typeof successCallback !== 'function' ? null : function(args) 
			{
				successCallback(args);
			},
			fail = typeof errorCallback !== 'function' ? null : function(code) 
			{
				errorCallback(code);
			};
			callbackID = B.callbackId(success, fail);

			return B.exec(_BARCODE, "sxfVpnInit", [callbackID, vpnMode, serverAddress]);
		},
		sxfVpnLoginUser : function (userName, password, token,successCallback, errorCallback )
		{
			var success = typeof successCallback !== 'function' ? null : function(args) 
			{
				successCallback(args);
			},
			fail = typeof errorCallback !== 'function' ? null : function(code) 
			{
				errorCallback(code);
			};
			callbackID = B.callbackId(success, fail);
			return B.exec(_BARCODE, "sxfVpnLoginUser", [callbackID, userName, password, token]);
		},
        sxfVpnLoginCert : function (certPath, password, successCallback, errorCallback) 
        {
        	var success = typeof successCallback !== 'function' ? null : function(args) {
				successCallback(args);
			},
			fail = typeof errorCallback !== 'function' ? null : function(code) {
				errorCallback(code);
			};
			callbackID = B.callbackId(success, fail);         	
            return B.exec(_BARCODE, "sxfVpnLoginCert", [callbackID, certPath, password]);
        },
        sxfVpnAuthSms:function(smsCode,successCallback, errorCallback){
        	var success = typeof successCallback !== 'function' ? null : function(args) {
				successCallback(args);
			},
			fail = typeof errorCallback !== 'function' ? null : function(code) {
				errorCallback(code);
			};
			callbackID = B.callbackId(success, fail);
            return B.exec(_BARCODE, "sxfVpnAuthSms", [callbackID,smsCode]);
        },
        sxfVpnLogOut : function (successCallback, errorCallback) 
        {
        	var success = typeof successCallback !== 'function' ? null : function(args) 
			{
				successCallback(args);
			},
			fail = typeof errorCallback !== 'function' ? null : function(code) 
			{
				errorCallback(code);
			};
			callbackID = B.callbackId(success, fail);         	

            return B.exec(_BARCODE, "sxfVpnLogOut", [callbackID]);
        },
        sxfVpnRelogin:function(successCallback, errorCallback)
        {
        	var success = typeof successCallback !== 'function' ? null : function(args) 
			{
				successCallback(args);
			},
			fail = typeof errorCallback !== 'function' ? null : function(code) 
			{
				errorCallback(code);
			};
			callbackID = B.callbackId(success, fail);         	

            return B.exec(_BARCODE, "sxfVpnRelogin", [callbackID]);
        }
    };
    window.plus.sxfVpn = sxfVpn;
}, true );