new Vue({
    el: "#app",
    data: {
        showTab: true
    },
    mounted: function() {
    
    },
    methods: {
        delay: function() {
            sne.navigateTo({
            	url: "./5-5HSE.html",
            	id: "5-5HSE.html"
            })
        }
    }
})