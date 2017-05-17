(function(global, document) {
    'use strict';

    const util = {
	
        loadJSON: function(file, callback) {
            let xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', file, true);
            xobj.onreadystatechange = () => {
                if (xobj.readyState === 4 && xobj.status == '200') {
                    callback(xobj.responseText);
                }
            };
            xobj.send(null);
        }
    };
    global.util = util;

})(window, document);
