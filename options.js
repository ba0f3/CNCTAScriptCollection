var CNCTA_SCRIPTS = JSON.parse(localStorage.getItem('CNCTA_SCRIPTS'));
var CNCTA_ENABLED = JSON.parse(localStorage.getItem('CNCTA_ENABLED'));
var CNCTA_GA = localStorage.getItem('CNCTA_GA');
console.log('CNCTA_GA', CNCTA_GA);
$(document).ready(function(){
	for(var i in CNCTA_SCRIPTS) {
		var script = CNCTA_SCRIPTS[i];

		var li = $('<div>');
		li.append("<div class='name'><input class='cb'" +  ((CNCTA_ENABLED[script.id] == true)?" checked='checked'":'') + " name='cb-"+script.id+"' type='checkbox' value='"+script.id+"' >" + script.name + " \
		<span class='version'>" + script.version + "</span></div>").appendTo('#scripts');
	}

	if(CNCTA_GA) {
		$("#ga").attr("checked", "checked");

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
	}

	$("#save").click(function() {
		var enabled = [];
		for(var i in CNCTA_SCRIPTS) {
			if($('input[name="cb-' + CNCTA_SCRIPTS[i].id + '"]').is(':checked')) {
				enabled[enabled.length] = CNCTA_SCRIPTS[i].id;
			}
		}
		localStorage.setItem('CNCTA_ENABLED', JSON.stringify(enabled));


		localStorage.setItem('CNCTA_GA', $("#ga").is(":checked"));


		$('#message').animate({opacity: 1}, 300, function(){
			$('#message').animate({opacity: 0}, 3000);
		});

	});
});