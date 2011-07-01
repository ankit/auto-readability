if (window === window.top) {
    chrome.extension.sendRequest({name: 'getSites'}, function(response) {
        init(response);
    });
}

var init = function(sites) {
    var len = sites.length;
    for (var i = 0; i < len; i ++) {
        if (location.href.matchesPattern(sites[i] + '/.+')) {
            run();
            return;
        }
    }
}

var run = function() {
    console.log('AutoReadability: Running Readability on this page...');
    location.href = 'javascript:(%28function%28%29%7Bwindow.baseUrl%3D%27https%3A//www.readability.com%27%3Bwindow.readabilityToken%3D%27%27%3Bvar%20s%3Ddocument.createElement%28%27script%27%29%3Bs.setAttribute%28%27type%27%2C%27text/javascript%27%29%3Bs.setAttribute%28%27charset%27%2C%27UTF-8%27%29%3Bs.setAttribute%28%27src%27%2CbaseUrl%2B%27/bookmarklet/read.js%27%29%3Bdocument.documentElement.appendChild%28s%29%3B%7D%29%28%29);';
    window.addEventListener('load', function(e) {
        run();
    });
}

/**
 * Checks if the string matches an stylebot pattern
 * @param {String} pattern The stylebot pattern.
 * @return {Boolean} True if the string matches the patern, false otherwise.
 */
String.prototype.matchesPattern = function(pattern) {
    try {
        pattern = pattern.
                /* Removes white spaces */
                replace(/ /g, '').
                /* Escapes ? | ( ) [ ] $ ^ \ { } */
                replace(/(\?|\||\(|\)|\[|\]|\$|\^|\\|\{|\})/g, '\\$1');
        /* Matches the beginning of the url, we only consider http(s) urls */
        pattern = '^https?://(www.)*' + pattern;
        pattern = new RegExp(pattern, 'i');
        return pattern.test(this);
    }

    catch (e) {
        console.log('Error occured while running pattern check', e);
        return false;
    }
};