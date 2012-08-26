var CURRENT_VERSION = "1.2.4";
var DEFAULT_SCRIPTS = [
    {
        id: 131289,
        name: "C&C:TA CNCOpt Link Button",
        version: "1.6",
        enabled: false, 
    },
    {
        id: 135955,
        name: "Tiberium Alliances Map",
        version: "1.8",
        enabled: true, 
    },
    {
        id: 136299,
        name: "Tiberium Alliances Formation Saver",
        version: "2.1.6",
        enabled: true, 
    },
    {
        id: 137978,
        name: "CnC: MH Tiberium Alliances Available Loot Summary",
        version: "1.6.4",
        enabled: true, 
    },
    {
        id: 138212,
        name: "Tiberium Alliances Combat Simulator",
        version: "1.4.1.5",
        enabled: true, 
    },
    {
        id: 138436,
        name: "Tiberium Alliances Zoom",
        version: "1.0.0",
        enabled: true, 
    },
    {
        id: 140988,
        name: "C&C Tiberium Alliances Wrapper",
        version: "0.9.2",
        enabled: true, 
    },
    {
        id: 140991,
        name: "MaelstromTools Dev",
        version: "0.1.1.6",
        enabled: true, 
    },
    {
        id: 135806,
        name: "CnC: Tiberium Alliances Shortcuts",
        version: "1.7.2",
        enabled: false, 
    }
];

if(localStorage.getItem('CNCTA_VERSION') != CURRENT_VERSION) {
	localStorage.setItem('CNCTA_VERSION', CURRENT_VERSION);
	localStorage.setItem('CNCTA_SCRIPTS', JSON.stringify(DEFAULT_SCRIPTS));

	var enabled =  JSON.parse(localStorage.getItem('CNCTA_ENABLED')) || [];
	for(var i in DEFAULT_SCRIPTS) {
		var script = DEFAULT_SCRIPTS[i];
    	if(script.enabled && !in_array(script.id, enabled)) {
    		enabled[enabled.length] = script.id;
    	}
    }
    localStorage.setItem('CNCTA_ENABLED', JSON.stringify(enabled));
}

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
	switch (request.type) {
	case "get":
	    var data = {};
	    if (request.name.constructor == Array) {
			for (var i = 0; i < request.name.length; i++) {
			    data[request.name[i]] = localStorage[request.name[i]];
			}
			sendResponse(data);
	    } else {
			sendResponse(localStorage[request.name]);
	    }
	    break;
	case "set":
	    localStorage[request.name] = request.value
	    break;
	default:
	    console.log("invalid request " + request);
	    break;
	}
    }
);


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
chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
    chrome.pageAction.show(sender.tab.id);
    sendResponse({});
});

chrome.pageAction.onClicked.addListener(function(){
    window.open(chrome.extension.getURL('options.html'));
})