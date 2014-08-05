/* JSHint strict mode tweak */
/*global $:false */
/*global Ember:false */
/*global Mousetrap:false */
/*global console:false */

/* A set of functions and tools to help in routine */
var helpers = {};
helpers.epoach = function() {
    /* Returns epoach in format: <seconds><milliseconds> */
    return ( new Date().getTime() );
};

helpers.dateToStr = function(d) {
   /* Args:
    *    d: date object.
    *
    * Returns:
    *    str, date formated according clients timezone.
    */
    var format = function (num) {
        if (num < 10) {
            return ['0', num].join('');
        }
        return num;
    };

    if (d === null) {
        return null;
    }

    var year = [
        d.getFullYear(),
        (d.getMonth() + 1),
        d.getDate()
    ];

    var hour  = [
        d.getHours(),
        d.getMinutes(),
        d.getSeconds()
    ];

    year = year.map(function(item) {
        return format(item);
    });

    hour = hour.map(function(item) {
        return format(item);
    });

    return [year.join('-'), hour.join(':')].join(' ');
};

helpers.lStrip = function(str, symbol) {
    resultStr = str;
    if (str[0] == symbol) {
        resultStr = str.substring(1);
    }
    return resultStr;
};

helpers.rStrip = function(str, symbol) {
    resultStr = str;
    if (str[str.length - 1] == symbol) {
        //return str.substring(1);
        resultStr = str.slice(0, -1);
    }
    return resultStr;
};

helpers.parseLinkHeader = function(Link) {
   /* Args:
    *    Link: str, HTTP responce *Link* header field.
    *
    * Returns:
    *    str, date formated according clients timezone.
    */
    if (!Link) {
        return null;
    }
    result = {};
    var links = Link.split(CONST.get('DELIM_LINKS'));
    $.each(links, function(idx, lValue) {
        var lnk = {};
        var params = $.trim(lValue).split(CONST.get('DELIM_LINK_PARAM'));
        if (params.length < 2) {
            return true;  // continue hack
        }
        $.each(params, function(idx, param) {
            if (idx > 0) {
                var paramParts = $.trim(param).split('=');
                var paramValueHalf = helpers.lStrip(paramParts[1].trim(), "\"");
                var paramValueCleared = helpers.rStrip(paramValueHalf.trim(), "\"");
                lnk[paramParts[0]] = paramValueCleared;
            }
        });

        var urlHalf = helpers.lStrip(params[0], "<");
        var urlCleared = helpers.rStrip(urlHalf, ">");
        lnk.url = urlCleared;

        if(!('rel' in lnk)) {
            return true;  // continue hack
        }
        result[lnk.rel] = lnk;
    });

    return result; 

};
