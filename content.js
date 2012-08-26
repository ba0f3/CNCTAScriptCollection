var USERSCRIPT_PATH = "http://userscripts.org/scripts/source/";

function isStorageSupported() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}
if(!isStorageSupported()) {
    console.warn("Local Storage is supported!");
}

function createRemoteScriptElement(url) {
    var script = document.createElement('script');
    script.setAttribute('src', url);
    document.getElementsByTagName('head')[0].appendChild(script);
}

/*------------------------------------------------*/
var CNCTA_SCRIPTS = null;
var CNCTA_REMOTE = null;

request = {
  type: "get",  
  name: ["CNCTA_SCRIPTS", "CNCTA_ENABLED", "CNCTA_REMOTE"]
}  
chrome.extension.sendMessage(request, function(settings){
    CNCTA_SCRIPTS = JSON.parse(settings['CNCTA_SCRIPTS']);
    CNCTA_REMOTE = settings['CNCTA_REMOTE'];
    CNCTA_ENABLED = JSON.parse(settings['CNCTA_ENABLED']);

    for(i in CNCTA_SCRIPTS)  {
        var script = CNCTA_SCRIPTS[i];

        if(in_array(script.id,CNCTA_ENABLED)) {
            var url = '';
            if(CNCTA_REMOTE == true)
            {
                url = USERSCRIPT_PATH + script.id + ".user.js";
            }
            else
            {
                url = chrome.extension.getURL('/') + "scripts/" + script.id + ".user.js";
            }
            //console.log("Attaching script: " + script.name);
            createRemoteScriptElement(url);        
        }    
    }
});



function in_array (needle, haystack, argStrict) {
    var key = '',
        strict = !! argStrict;
 
    if (strict) {
        for (key in haystack) {
            if (haystack[key] === needle) {
                return true;
            }
        }
    } else {
        for (key in haystack) {
            if (haystack[key] == needle) {
                return true;
            }
        }
    }
 
    return false;
}

/*------------------------------------------------*/
chrome.extension.sendRequest({}, function(response) {});