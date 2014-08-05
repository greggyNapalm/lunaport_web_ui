/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers, app */
'use strict';

app.controller('StatusCtrl', function StatusCtrl(
    $scope,
    ngTableParams,
    util, data_factory1) {

    var adapt_resource = function(rest_repr) {
        rest_repr.uptime.started_at_local = util.utc_to_tbl(rest_repr.uptime.started_at);
        return rest_repr;
    };

    //main
    $scope.waiting = {"stat_resource": true};
    $scope.links = CONST.get('LINKS');
    $scope.links.gray_log_production = $scope.links.logview_base + 'messages/universalsearch?timespan=0&query=env%3Dproduction'
    data_factory1.get_status()
        .then(function(resp) {
            console.info(resp.data);
            $scope.status = adapt_resource(resp.data);
            $scope.waiting.stat_resource = false;
        }, function(resp) {data_factory1.handle_error(resp);});

});
