var _this = this;
new Vue({
    el: "#app",
    data: {
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
        	"unit": "",  // 使用机组
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
    },
    mounted: function() {
        _this = this;
		function plusReady() {
			_this.prevParam = plus.webview.currentWebview().param;
			
		}
		if(window.plus) {
			plusReady()
		} else {
			document.addEventListener('plusready', plusReady, false);
		}
    },
    methods: {
        // 新建检查的提交或保存
        submit: function(e) {   // 0保存 1提交
            
        }
    }
})