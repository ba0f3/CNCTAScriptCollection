var CURRENT_VERSION = "1.2.4.4";
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

    if(enabled instanceof Array) { //migrate from 1.2.4
        var tmp = {}
        for(var i in enabled) {
            var id = enabled[i];
            tmp[id] = true;
        }
        enabled = tmp;
    }

	for(var i in DEFAULT_SCRIPTS) {
		var script = DEFAULT_SCRIPTS[i];

        if(typeof enabled[script.id] == 'undefined') {
            enabled[script.id] = script.enabled;
        }
    }
    if(CURRENT_VERSION == "1.2.4.4") {
         // force CnCOpt enabled again
        enabled[131289] = true;
    }
    

    localStorage.setItem('CNCTA_ENABLED', JSON.stringify(enabled));
}

function  processRequest(request, sender, sendResponse) {
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
    case "pageAction":
        chrome.pageAction.show(sender.tab.id);
        sendResponse({});
        break;

    default:
        console.log("invalid request " + request);
        break;
    }
}

if(typeof chrome.extension.sendMessage == 'undefined') {
    chrome.extension.onRequest.addListener(processRequest);    
} else {
    chrome.extension.onMessage.addListener(processRequest);
}

/*------------------------------------------------*/
chrome.pageAction.onClicked.addListener(function(){
    window.open(chrome.extension.getURL('options.html'));
})
/*------------------------------------------------*/
var CNCTA_GA = localStorage.getItem('CNCTA_GA');
if(CNCTA_GA == null) {
    localStorage.setItem('CNCTA_GA', true);
    CNCTA_GA = true;
}
if(CNCTA_GA)  {
     var _gaq = _gaq || [];
    _gaq.push(['_setAccount', 'UA-15252221-7']);
    _gaq.push(['_trackPageview']);
    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
}