// ==UserScript==
// @name        C&C:Tiberium Alliances Extended Chathelper
// @namespace   CNCTAChatHelper
// @description Automatically adding the [coords][/coords] & [url][/url] to chat message
// @include https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version     1.0.4
// ==/UserScript==
(function () {
  var CNCTAChatHelper_main = function () {
    try {
      function createChatHelper() {
		console.log('C&C:Tiberium Alliances Extended Chathelper loaded.');
		try {
	    	document.onkeydown = function (e) {
				e = e || window.event;
				if (e.keyCode === 13) {
					var inputField = document.querySelector('input:focus, textarea:focus');
					var text = inputField.value;
					text = text.replace(/(\[coords\])*([0-9]{3})[:|.]([0-9]{3})(\[\/coords\])*/gi, function(){
						var result = new Array();
						result.push('[coords]');
						result.push(arguments[2]);
						result.push(':');
						result.push(arguments[3]);
						result.push('[/coords]');
					    return result.join('');
					});
					// auto url
					text = text.replace(/(\[url\])*(https?:\/\/)?([\da-z\.-]+)(\.[a-z]{2,6})([\/\w\.\-\=\?\&]*)*\/?(\[\/url\])*/gi, function(){
					    var result = new Array();
					    result.push('[url]');
					    if(arguments[2] !== undefined) {        
					        result.push(arguments[2]); // http[s]://
					    }
					    result.push(arguments[3]); // domain
					    result.push(arguments[4]); // ext
					    result.push(arguments[5]); // query string
					    result.push('[/url]');
					    return result.join('');
					        
					});
					// shorthand for alliance
					text = text.replace(/\[a\]([a-z0-9_\-\s]+)\[\/a\]/gi, '[alliance]$1[/alliance]');
					// shorthand for player
					text = text.replace(/\[p\]([a-z0-9_\-\s]+)\[\/p\]/gi, '[player]$1[/player]');
					inputField.value = text;
				}

				//return false;
			};
		} catch(e) {
			console.log(e);
		}
		window.onkeypress = function (te) {
			/* Alt+1 for Coordinates */
			if (te.charCode == 49 && te.altKey && !te.altGraphKey && !te.ctrlKey) {
				var inputField = document.querySelector('input:focus, textarea:focus');
				if (inputField !== null){
					//var coordstext=prompt("Coordinates (Syntax: 123456, instead of 123:456)","");
					//if (coordstext!== null){
					//coordstext=coordstext.substr(0,3) + "" + coordstext.substr(3,5);
					//inputField.value += '[coords]'+coordstext+'[/coords]';
					//}
					var re = new RegExp("([0-9]{3}[:][0-9]{3})","g");
					inputField.value = inputField.value.replace(re,"[coords]"+"$1"+"[/coords]");
				}
			}
			/* Alt+2 for URLs */
				if (te.charCode == 50 && te.altKey && !te.altGraphKey && !te.ctrlKey) {
				var inputField = document.querySelector('input:focus, textarea:focus');
				if (inputField !== null){
					var url=prompt("Website (Syntax: google.com or www.google.com)","");
					if (url!== null){
					inputField.value += '[url]'+url+'[/url]';
					}	
				}
			}	
			/* Alt+3 for players */
				if (te.charCode == 51 && te.altKey && !te.altGraphKey && !te.ctrlKey) {
				var inputField = document.querySelector('input:focus, textarea:focus');
				if (inputField !== null){
					var playername=prompt("Playername (Syntax: playername)","");
					if (playername!== null){
					inputField.value += '[player]'+playername+'[/player]';
					}	
				}
			}	
			/* Alt+4 for alliances */
				if (te.charCode == 52 && te.altKey && !te.altGraphKey && !te.ctrlKey) {
				var inputField = document.querySelector('input:focus, textarea:focus');
				if (inputField !== null){
					var alliancename=prompt("Alliancename (Syntax: alliance)","");
					if (alliancename!== null){
					inputField.value += '[alliance]'+alliancename+'[/alliance]';
					}	
				}
			}
		};
      }
    } catch (e) {
      console.log("createChatHelper: ", e);
    }

    function CNCTAChatHelper_checkIfLoaded() {
      try {
        if (typeof qx !== 'undefined') {
          createChatHelper();
        } else {
          window.setTimeout(CNCTAChatHelper_checkIfLoaded, 1000);
        }
      } catch (e) {
        console.log("CNCTAChatHelper_checkIfLoaded: ", e);
      }
    }
	window.setTimeout(CNCTAChatHelper_checkIfLoaded, 1000);
  };
  try {
    var CNCTAChatHelper = document.createElement("script");
    CNCTAChatHelper.innerHTML = "(" + CNCTAChatHelper_main.toString() + ")();";
    CNCTAChatHelper.type = "text/javascript";
    document.getElementsByTagName("head")[0].appendChild(CNCTAChatHelper);
  } catch (e) {
    console.log("CNCTAChatHelper: init error: ", e);
  }
})();