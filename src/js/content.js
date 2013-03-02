function createRemoteScriptElement(url) {
    var script = document.createElement('script');
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);
}

function sendMessage(request, callback) {
    if (typeof chrome.extension.sendMessage === 'undefined') {
        chrome.extension.sendRequest(request, callback);
    }
    else {
        chrome.extension.sendMessage(request, callback);
    }
}

/*------------------------------------------------*/
var storage = chrome.storage.sync;
storage.get(['CNCTA_SCRIPTS', 'CNCTA_ENABLED', 'CNCTA_GA'], function(config) {
    for (var i in config.CNCTA_SCRIPTS) {
        if(config.CNCTA_SCRIPTS.hasOwnProperty(i)) {
            var script = config.CNCTA_SCRIPTS[i];

            if (config.CNCTA_ENABLED['s_' + script.id] === true) {
                var url = chrome.extension.getURL('/') + "scripts/" + script.id + ".user.js";
                createRemoteScriptElement(url);
            }
        }
    }
});
sendMessage({type: "pageAction"}, function(response) {});