var CNCTA_SCRIPTS = JSON.parse(localStorage.getItem('CNCTA_SCRIPTS'));
var CNCTA_ENABLED = JSON.parse(localStorage.getItem('CNCTA_ENABLED'));
$(document).ready(function(){
	for(var i in CNCTA_SCRIPTS) {
		var script = CNCTA_SCRIPTS[i];

		var li = $('<div>');
		li.append("<div class='name'><input class='cb'" +  (in_array(script.id, CNCTA_ENABLED, false)?" checked='checked'":'') + " name='cb-"+script.id+"' type='checkbox' value='"+script.id+"' >" + script.name + " \
		<span class='version'>" + script.version + "</span></div>").appendTo('#scripts');
	}
	$("#save").click(function() {
		var enabled = [];
		for(var i in CNCTA_SCRIPTS) {
			if($('input[name="cb-' + CNCTA_SCRIPTS[i].id + '"]').is(':checked')) {
				enabled[enabled.length] = CNCTA_SCRIPTS[i].id;
			}
		}
		localStorage.setItem('CNCTA_ENABLED', JSON.stringify(enabled));

		$('#message').animate({opacity: 1}, 300, function(){
			$('#message').animate({opacity: 0}, 3000);
		})
	});
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