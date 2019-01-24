mui.init();
function plusReady(){
    plus.webview.currentWebview().setStyle({
        scrollIndicator: 'none'
    });
    
}
if (window.plus) {
    plusReady()
} else{
    document.addEventListener('plusready',plusReady,false);
}


function pullupRefresh() {
    
}

function pulldownRefresh() {
    
}