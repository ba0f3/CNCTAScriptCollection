var USERSCRIPT_PATH = "http://userscripts.org/scripts/source/";

function isStorageSupported() {
    try {
        return 'localStorage' in window && window.localStorage !== null;
    }
    catch (e) {
        return false;
    }
}
if (!isStorageSupported()) {
    console.warn("Local Storage is supported!");
}

function createRemoteScriptElement(url) {
    var script = document.createElement('script');
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);
}


function processResponse(settings) {
    var CNCTA_SCRIPTS = JSON.parse(settings['CNCTA_SCRIPTS']);
    var CNCTA_REMOTE = settings['CNCTA_REMOTE'];
    var CNCTA_ENABLED = JSON.parse(settings['CNCTA_ENABLED']);
    var CNCTA_GA = settings['CNCTA_GA'] || true;

    for (var i in CNCTA_SCRIPTS) {
        var script = CNCTA_SCRIPTS[i];

        if (CNCTA_ENABLED[script.id] === true) {
            var url = '';
            if (CNCTA_REMOTE === true) {
                url = USERSCRIPT_PATH + script.id + ".user.js";
            }
            else {
                url = chrome.extension.getURL('/') + "scripts/" + script.id + ".user.js";
            }
            //console.log("Attaching script: " + script.name);
            createRemoteScriptElement(url);
        }
    }
}

function sendMessage(request, callback) {
    if (typeof chrome.extension.sendMessage == 'undefined') {
        chrome.extension.sendRequest(request, callback);
    }
    else {
        chrome.extension.sendMessage(request, callback);
    }
}

/*------------------------------------------------*/
var CNCTA_SCRIPTS = null;
var CNCTA_REMOTE = null;
var CNCTA_GA = true;

sendMessage({
    type: "get",
    name: ["CNCTA_SCRIPTS", "CNCTA_ENABLED", "CNCTA_REMOTE", "CNCTA_GA"]
}, processResponse);
sendMessage({
    type: "pageAction"
}, function(response) {});