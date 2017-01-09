'use strict';

/* global canvas, vrHMD, webGL */

(function (global, document) {
    'use strict';

    var util = {

        loadJSON: function loadJSON(file, callback) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', file, true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState === 4 && xobj.status == '200') {
                    callback(xobj.responseText);
                }
            };
            xobj.send(null);
        }
    };
    global.util = util;
})(window, document);