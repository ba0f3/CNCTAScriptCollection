var CNCTA_SCRIPTS = JSON.parse(localStorage.getItem('CNCTA_SCRIPTS'));
var CNCTA_ENABLED = JSON.parse(localStorage.getItem('CNCTA_ENABLED'));
var CNCTA_GA = localStorage.getItem('CNCTA_GA');

var backgroundWindow = chrome.extension.getBackgroundPage();
$(document).ready(function(){
	for(var i in CNCTA_SCRIPTS) {
		var script = CNCTA_SCRIPTS[i];

		var li = $('<div>');
		li.append("<div class='name'><input class='cb'" +  ((CNCTA_ENABLED[script.id] == true)?" checked='checked'":'') + " name='cb-"+script.id+"' type='checkbox' value='"+script.id+"' >" + script.name + " \
		<span class='version'>" + script.version + "</span></div>").appendTo('#scripts');
	}

	if(CNCTA_GA) {
		$("#ga").attr("checked", "checked");

		backgroundWindow._gaq.push(['_trackPageview', '/options.html']);
	}

	$("#save").click(function() {
		console.log(this);
		var enabled = [];
		for(var i in CNCTA_SCRIPTS) {
			enabled[CNCTA_SCRIPTS[i].id] = $('input[name="cb-' + CNCTA_SCRIPTS[i].id + '"]').is(':checked');

			var tmp = enabled[CNCTA_SCRIPTS[i].id]?'enabled':'disabled';
			backgroundWindow._gaq.push(['_trackEvent', CNCTA_SCRIPTS[i].name, tmp]);
		}
		localStorage.setItem('CNCTA_ENABLED', JSON.stringify(enabled));

		localStorage.setItem('CNCTA_GA', $("#ga").is(":checked"));

		$('#message').animate({opacity: 1}, 300, function(){
			$('#message').animate({opacity: 0}, 3000);
		});

		backgroundWindow._gaq.push(['_trackEvent', 'Options', 'saved']);
	});
});