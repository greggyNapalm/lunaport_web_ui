/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global jQuery, $, _, angular, ya, CONST, app, APIexc */
'use strict';

app.factory('logs_provider', ['$http', '$q', 'AlertService', 'RuntimeCache', function($http, $q, AlertService, RuntimeCache) {
    var api_url_base = CONST.get('API_URL').LOGS;
    var ui_url_base = CONST.get('LINKS').logview_base;
    var data_factory = {
        http: $http,
        q: $q,
        AlertService: AlertService,
        cache: RuntimeCache
    };
    data_factory.search =  function (query) {
        var q_string = _.pairs(query)
            .map(function(pair){ return pair.join(':'); })
            .join(' AND ');
        var url = api_url_base + '?q=' + encodeURIComponent(q_string);
        var ui_url = ui_url_base + '/search?rangetype=relative&relative=0&from=&to=&q=' + encodeURIComponent(q_string);
        return {
            'api_url': url,
            'ui_url': ui_url,
            'defer': $http.get(url)
        };
    };
    return data_factory;
}]);
