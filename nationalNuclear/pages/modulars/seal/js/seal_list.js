var _this = null;

new Vue({
    el: "#app",
    data: {
        list: [
            {
                title: "部门负责人审批",
                approvalPeople: "胡菁云",
                approvalDate: "2018-12-11 06:12:36",
                approvalOpinion: "转发给上一级",
                type: "转发",
                departmentName: "办公室"
            },
            {
                title: "部门负责人",
                approvalPeople: "白雪",
                approvalDate: "2018-12-11 06:12:36",
                approvalOpinion: "转发给上一级",
                type: "同意",
                departmentName: "办公室"
            },
            {
                title: "机要秘书",
                approvalPeople: "胡菁云",
                approvalDate: "2018-12-11 06:12:36",
                approvalOpinion: "转发给上一级",
                type: "确认",
                departmentName: "办公室"
            }
        ]
    },
    mounted: function() {
        
    },
    methods: {
        
    }
})