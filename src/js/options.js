var storage = chrome.storage.sync;
var backgroundWindow = chrome.extension.getBackgroundPage();
$(document).ready(function () {
    storage.get(['CNCTA_SCRIPTS', 'CNCTA_ENABLED', 'CNCTA_GA'], function (config) {
        for (var i in config.CNCTA_SCRIPTS) {
            if (config.CNCTA_SCRIPTS.hasOwnProperty(i)) {
                var script = config.CNCTA_SCRIPTS[i];

                var li = $('<div>');
                var html = "<div class='name'>";
                html += "<input id='s-" + script.id + "' class='cb'" + ((config.CNCTA_ENABLED['s_' + script.id] === true) ? " checked='checked'" : '') + " name='cb-" + script.id + "' type='checkbox' value='" + script.id + "' >";
                html += "<label for='s-" + script.id + "'>" + script.name + "</label>";
                html += "<span class='version'>" + script.version + "</span>";
                if (typeof script.link === "undefined") {
                    html += "[<a title='Go to homepage' target='_blank' href='http://userscripts-mirror.org/scripts/show/" + script.id + "'>&#926;</a>]";
                } else {
                    html += "[<a title='Go to homepage' target='_blank' href='" + script.link + "'>&#926;</a>]";
                }
                html += "</div>";
                li.append(html).appendTo('#scripts');
            }
        }

        if (config.CNCTA_GA) {
            $("#ga").attr("checked", "checked");

            backgroundWindow.ga('send', 'pageview', '/options.html');
        }

        $("#close").click(function () {
            window.close();
        });

        $("#save").click(function () {
            var enabled = {};
            for (var i in config.CNCTA_SCRIPTS) {
                if (config.CNCTA_SCRIPTS.hasOwnProperty(i)) {
                    var script = config.CNCTA_SCRIPTS[i];
                    enabled['s_' + config.CNCTA_SCRIPTS[i].id] = $('input[name="cb-' + script.id + '"]').is(':checked');

                    var tmp = enabled[config.CNCTA_SCRIPTS[i].id] ? 'enabled' : 'disabled';
                    backgroundWindow.ga('send', 'event', config.CNCTA_SCRIPTS[i].name, tmp);
                }
            }
            storage.set({
                CNCTA_ENABLED: enabled,
                CNCTA_GA: $("#ga").is(":checked")
            });

            $('#message').animate({
                opacity: 1
            }, 300, function () {
                $('#message').animate({
                    opacity: 0
                }, 3000);
            });
            backgroundWindow.ga('send', 'event', 'Options', 'saved');
        });
    });
});
