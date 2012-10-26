var DEFAULT_SCRIPTS = [ {
	id : 131289,
	name : "C&C:TA CNCOpt Link Button",
	version : "1.6",
	enabled : true
}, {
	id : 136299,
	name : "Tiberium Alliances Formation Saver",
	version : "2.1.8",
	enabled : true
}, {
	id : 137978,
	name : "CnC: MH Tiberium Alliances Available Loot Summary",
	version : "1.8.0",
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
	version : "0.1.1.9",
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
	id : 149068,
	name : "infernal wrapper",
	version : "0.376877",
	enabled : true
}, {
	id : 145717,
	name : "Tiberium Alliances Combat Simulator (Basic)",
	version : "2.0",
	enabled : true
}, {
	id : 147335,
	name : "C&C Combat Simulator",
	version : "0.2.1",
	enabled : false
}, {
	id : 145168,
	name : "C&C:Tiberium Alliances Maelstrom ADDON Basescanner",
	version : "1.0",
	enabled : true
}, {
	id : 147476,
	name : "Tiberium Alliances Map and Zoom",
	version : "1.1",
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
} ];

var CURRENT_VERSION = chrome.app.getDetails().version;
var PREVIOUS_VERSION = localStorage.getItem('CNCTA_VERSION');
if (CURRENT_VERSION !== PREVIOUS_VERSION) {
	localStorage.setItem('CNCTA_VERSION', CURRENT_VERSION);
	localStorage.setItem('CNCTA_SCRIPTS', JSON.stringify(DEFAULT_SCRIPTS));

	window.open(chrome.extension.getURL('updated.html'));

	var enabled = JSON.parse(localStorage.getItem('CNCTA_ENABLED'));
	if (enabled === null || typeof enabled !== 'object') {
		enabled = {};
	}
	var tmp = {};

	for (var i in DEFAULT_SCRIPTS) {
		var script = DEFAULT_SCRIPTS[i];		
		tmp[script.id] = enabled[script.id] || script.enabled;
	}
	localStorage.setItem('CNCTA_ENABLED', JSON.stringify(tmp));
}

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
var CNCTA_GA = localStorage.getItem('CNCTA_GA');
if (CNCTA_GA === null) {
	localStorage.setItem('CNCTA_GA', true);
	CNCTA_GA = true;
}
if (CNCTA_GA) {
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
