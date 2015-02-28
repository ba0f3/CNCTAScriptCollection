var backgroundWindow = chrome.extension.getBackgroundPage();
$(document).ready(function () {
    $('#options').click(function () {
        window.open(chrome.extension.getURL('options.html'));
    });
    $('#close').click(function () {
        window.close();
    });
    $('#version').text(chrome.app.getDetails().version);
    $('#changelog').load(chrome.extension.getURL('CHANGELOG'));

    backgroundWindow.ga('send', 'pageview', '/updated.html');
});