var DEFAULT_SCRIPTS = [{
	id : 131289,
	name : "C&C:TA CNCOpt Link Button",
	version : "1.7.3",
	enabled : true
}, {
	id : 136299,
	name : "Tiberium Alliances Formation Saver",
	version : "2.1.8",
	enabled : false
}, {
	id : 137978,
	name : "CnC: MH Tiberium Alliances Available Loot Summary",
	version : "1.8.2",
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
	version : "0.1.2.0",
	enabled : true
}, {
	id : 135806,
	name : "CnC: Tiberium Alliances Shortcuts",
	version : "1.8.0",
	enabled : false
}, {
	id : 138212,
	name : "Tiberium Alliances Combat Simulator",
	version : "1.6.4",
	enabled : true
}, {
	id : 140988,
	name : "infernal wrapper",
	version : "0.378171.3",
	enabled : true
}, {
	id : 145717,
	name : "Tiberium Alliances Combat Simulator (Basic)",
	version : "0.3.1",
	enabled : false
}, {
	id : 147335,
	name : "C&C Combat Simulator",
	version : "0.2.1",
	enabled : false
}, {
	id : 145168,
	name : "C&C:Tiberium Alliances Maelstrom ADDON Basescanner",
	version : "1.4",
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
	version: "1.0.10",
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
}];

var storage = chrome.storage.sync;

storage.get(['CNCTA_VERSION', 'CNCTA_ENABLED', 'CNCTA_GA'], function(config) {
	if (chrome.app.getDetails().version !== config.CNCTA_VERSION) {
		window.open(chrome.extension.getURL('updated.html'));
		if(!config.CNCTA_ENABLED) {
			config.CNCTA_ENABLED = {};
		}
		var tmp = {};

		for (var i in DEFAULT_SCRIPTS) {
			var script = DEFAULT_SCRIPTS[i];
			if(typeof config.CNCTA_ENABLED['s_' + script.id] == 'undefined' || config.CNCTA_ENABLED['s_' + script.id] === null) {
				tmp['s_' + script.id] = script.enabled;
			} else {
				tmp['s_' + script.id] = config.CNCTA_ENABLED['s_' + script.id];
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
	if(config.CNCTA_GA === true) {	
		var _gaq = _gaq || [];
		_gaq.push([ '_setAccount', 'UA-15252221-7' ]);
		_gaq.push([ '_trackPageview' ]);
		(function() {
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
	"use strict";
	switch (request.type) {
	case "get":
		var data = {};
		if (request.name.constructor == Array) {
			for ( var i = 0; i < request.name.length; i++) {
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

if (typeof chrome.extension.sendMessage == 'undefined') {
	chrome.extension.onRequest.addListener(processRequest);
} else {
	chrome.extension.onMessage.addListener(processRequest);
}

/*------------------------------------------------*/
chrome.pageAction.onClicked.addListener(function() {
	window.open(chrome.extension.getURL('options.html'));
});
/*------------------------------------------------*/
