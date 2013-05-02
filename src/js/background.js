var DEFAULT_SCRIPTS = [{
    id : 131289,
    name : "C&C:TA CNCOpt Link Button",
    version : "1.7.5",
    enabled : true
}, {
    id : 136299,
    name : "Tiberium Alliances Formation Saver",
    version : "2.1.8",
    enabled : false
}, {
    id : 138212,
    name : "TACS (Tiberium Alliances Combat Simulator)",
    version : "2.2",
    enabled : true
}, {
    id : 1382121,
    name : "TACS 3 (Tiberium Alliances Combat Simulator)",
    version : "3.0b",
    enabled : false
}, {
    id : 137978,
    name : "CnC: MH Tiberium Alliances Available Loot Summary",
    version : "1.8.3",
    enabled : true
}, {
    id : 145657,
    name : "CnC: MH Tiberium Alliances Pure Loot Summary",
    version : "1.7.2p",
    enabled : false
}, {
    id : 138436,
    name : "Tiberium Alliances Zoom",
    version : "1.0.0",
    enabled : true
}, {
    id : 140991,
    name : "MaelstromTools Dev",
    version : "0.1.3.2",
    enabled : true
}, {
    id : 135806,
    name : "CnC: Tiberium Alliances Shortcuts",
    version : "1.8.0",
    enabled : false
}, {
    id : 140988,
    name : "infernal wrapper",
    version : "0.390737.5",
    enabled : true
}, {
    id : 145717,
    name : "Tiberium Alliances Combat Simulator (Basic)",
    version : "0.3.1",
    enabled : false
}, {
    id : 147335,
    name : "C&C Combat Simulator",
    version : "0.4",
    enabled : false
}, {
    id : 145168,
    name : "C&C:Tiberium Alliances Maelstrom ADDON Basescanner",
    version : "1.8.4",
    enabled : true
}, {
    id : 149809,
    name : "C&C:Tiberium Alliances Maelstrom ADDON Citycolor",
    version : "0.4",
    enabled : true
}, {
    id : 138386,
    name : "CnC Tiberium Coord Box Shortcut",
    version : "1",
    enabled : false
}, {
    id: 149093,
    name: "CnC: Tiberium Alliances Map (KSX-Mod)",
    version: "1.5",
    enabled: true
}, {
    id: 151965,
    name: "C&C:Tiberium Alliances Extended Chathelper",
    version: "1.0.11",
    enabled: true
}, {
    id: 152787,
    name: "C&C:Tiberium Alliances Coords Button",
    version: "1.0.1",
    enabled: true
}, {
    id: 153193,
    name: "C&C:TA Compass Movable",
    version: "1.1.0",
    enabled: true
}, {
    id: 152177,
    name: "C&C:Tiberium Alliances Extended Chathelper Enhanced",
    version: "3.0.0",
    enabled: false
}, {
    id: 158565,
    name: "CustomFlunik Tools",
    version: "20130415a",
    enabled: true
}, {
    id: 154546,
    name: "The Green Cross - Tiberium Alliances Combat Simulator",
    version: "3.2.2",
    enabled: false
}, {
    id: 158164,
    name: "Tiberium Alliances Transfer All Resources",
    version: "1.5.1",
    enabled: true
}, {
    id: 158919,
    name: "The Green Cross - Tiberium Alliances Tools",
    version: "0.5",
    enabled: true
}, {
    id: 159150,
    name: "Tiberium Alliances PvP/PvE Player Info Mod",
    version: "1.1",
    enabled: true
}, {
    id: 149251,
    name: "CnC: Tiberium Alliances Info",
    version: "1.0.3",
    enabled: false
}, {
    id: 155157,
    name: "Tiberium Alliances Info Sticker",
    version: "1.11.1",
    enabled: false
}, {
    id: 159496,
    name: "CnC:Tiberium Aliances Navigator - Compass",
    version: "1.2.1",
    enabled: false
}, {
    id: 158869,
    name: "C&C Tiberium Alliances Flunik Tools: Custom AutoUpgrade",
    version:  "0.5.7.09",
    enabled: false
}, {
    id : 160800,
    name : "CnC: Tiberium Alliances Available Loot Summary + Info",
    version : "2.0.0",
    enabled : false
}, {
    id : 165625,
    name : "Tiberium Alliances BaseNavBar Reorderer",
    version : "1.0",
    enabled : true
}];

var storage = chrome.storage.sync;

storage.get(['CNCTA_VERSION', 'CNCTA_ENABLED', 'CNCTA_GA'], function (config) {
    if (chrome.app.getDetails().version !== config.CNCTA_VERSION) {
        window.open(chrome.extension.getURL('updated.html'));
        if (!config.CNCTA_ENABLED) {
            config.CNCTA_ENABLED = {};
        }
        var tmp = {};

        for (var i in DEFAULT_SCRIPTS) {
            if (DEFAULT_SCRIPTS.hasOwnProperty(i)) {
                var script = DEFAULT_SCRIPTS[i];
                if (typeof config.CNCTA_ENABLED['s_' + script.id] === 'undefined' || config.CNCTA_ENABLED['s_' + script.id] === null) {
                    tmp['s_' + script.id] = script.enabled;
                } else {
                    tmp['s_' + script.id] = config.CNCTA_ENABLED['s_' + script.id];
                }
            }
        }
        storage.set({
            'CNCTA_VERSION': chrome.app.getDetails().version,
            'CNCTA_SCRIPTS': DEFAULT_SCRIPTS,
            'CNCTA_ENABLED': tmp
        });
    }

    if (!config.CNCTA_GA) {
        storage.set({'CNCTA_GA': true});
        config.CNCTA_GA = true;
    }
    if (config.CNCTA_GA === true) {    
        var _gaq = _gaq || [];
        _gaq.push([ '_setAccount', 'UA-15252221-7' ]);
        _gaq.push([ '_trackPageview' ]);
        (function () {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = 'https://ssl.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();
    }
});

function processRequest(request, sender, sendResponse) {
    switch (request.type) {
    case "get":
        var data = {};
        if (request.name.constructor === Array) {
            for (var i = 0; i < request.name.length; i++) {
                data[request.name[i]] = localStorage[request.name[i]];
            }
            sendResponse(data);
        } else {
            sendResponse(localStorage[request.name]);
        }
        break;
    case "set":
        localStorage[request.name] = request.value;
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

if (typeof chrome.extension.sendMessage === 'undefined') {
    chrome.extension.onRequest.addListener(processRequest);
} else {
    chrome.extension.onMessage.addListener(processRequest);
}

/*------------------------------------------------*/
chrome.pageAction.onClicked.addListener(function () {
    window.open(chrome.extension.getURL('options.html'));
});
/*------------------------------------------------*/
