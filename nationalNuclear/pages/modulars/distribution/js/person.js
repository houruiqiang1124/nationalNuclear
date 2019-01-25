var _this = null;

new Vue({
    el: "#app",
    data: {
        checkUser: {},
        personList: [
            {
                department: "财务部",
                person: [
                    {
                        name: "胡菁云",
                        id: "hujingyun",
                        check: false
                    }
                    
                ]
                
            },
            {
                department: "研发部",
                person: [
                    {
                        name: "蔡家有",
                        id: "caijiayou",
                        check: false
                    }
                    
                ]
            },
            {
                department: "市场部",
                person: [
                    {
                        name: "白雪",
                        id: "baixue",
                        check: false
                    }
                    
                ]
            }
        ]
    },
    mounted: function() {
        _this = this;
        function plusReady(){
            _this.getPerson();
        }
        if (window.plus) {
            plusReady()
        } else{
            document.addEventListener('plusready',plusReady,false);
        }
        
    },
    methods: {
        check: function(e) {
            console.log(e)
            _this.checkUser = e;
            for(i in _this.personList) {
                for(j in _this.personList[i].person)
                _this.personList[i].person[j].check = false;
            }
            e.check = true;
        },
        
        getPerson: function() {
            var param = {
                "action": {
                    "userId": "hujingyun",
                    "docbase": "SNPEC_T",
                    "organId": "O0000000000000000008",
                    "returnCustomGroup": "FALSE",
                    "returnCustomPhrase": "FALSE",
                    "actionCode": "MWS_USERLIST"
                }
            }
            sne.xmlAjax(sne.json2xml(param), function(res) {
                var jsonText = sne.xml2json(sne.xmlToString(res).replace(/\n/g, ""));
                var json = JSON.parse(jsonText);
                console.log(JSON.stringify(json))
            })
        }
    }
})