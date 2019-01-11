var _this = null;

new Vue({
    el: "#app",
    data: {
       list: [
            {
                title: "项目",
                subTitle: "设置您的项目",
                icon: "images/5-2-icon1@2x.png",
                url: "./default/defaultProjNo.html",
                id: "defaultProjNo.html"
            },
            {
                title: "常用区域",
                subTitle: "所有区域中选择常用区域",
                icon: "images/5-2-icon2@2x.png",
                url: "./default/defaultArea.html",
                id: "defaultArea.html"
            },
            {
                title: "默认区域",
                subTitle: "常用区域中一个作为默认区域",
                icon: "images/5-2-icon3@2x.png",
                url: "./default/defaultArea1.html",
                id: "defaultArea1.html"
            },
            {
                title: "默认责任单位",
                subTitle: "默认区域对应的责任单位",
                icon: "images/5-2-icon4@2x.png",
                url: "./default/defaultUnit.html",
                id: "defaultUnit.html"
            },
            {
                title: "默认机组",
                subTitle: "设置您的机组",
                icon: "images/5-2-icon4@2x.png",
                url: "./default/defaultCrew.html",
                id: "defaultCrew.html"
            },
            {
                title: "默认隐患类型",
                subTitle: "设置您的隐患类型",
                icon: "images/5-2-icon4@2x.png",
                url: "./default/defaultDanger.html",
                id: "defaultDanger.html"
            },
            {
                title: "默认整改责任人",
                subTitle: "设置您的整改责任人",
                icon: "images/5-2-icon4@2x.png",
                url: "./default/defaultResponsible.html",
                id: "defaultResponsible.html"
            },
            {
                title: "常用抄送人",
                subTitle: "设置常用抄送人",
                icon: "images/5-2-icon5@2x.png",
                url: "./default/defaultCs.html",
                id: "defaultCs.html"
            }
       ]
    },
    mounted: function() {
        _this = this;
    },
    methods: {
        goPage: function(e) {
            sne.navigateTo({url:e.url, id: e.id});
        }
    }
})