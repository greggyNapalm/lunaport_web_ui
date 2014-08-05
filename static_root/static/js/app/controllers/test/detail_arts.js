/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers, app */
'use strict';

app.controller('TestDetailArtsCtrl', function TestsCtrl(
    $scope, $filter, $http, $routeParams,
    ngTableParams,
    util, data_factory1) {

    var adapt_arts = function(arts) {
        /* Test artefact API resource adaptor.
        */
        return _.map(arts, function(v, k){ 
            return {
                'name':k,
                'link':v,
                'link_public': util.art_public_lnk(v)
            };
        });
    };

    //main
    $scope.popover = {
        'arts': CONST.get('arts_popover'),
    };

    $scope.test_id = $routeParams.test_id;
    $scope.tbl_arts = new ngTableParams({
        page: 1,            // show first page
        total: 21,           // length of data
        count: 22,          // count per page
        counts: [],
        sorting: {
            name: 'desc'     // initial sorting
        }
    });

    $scope.$watch('tbl_arts', function(params){
        data_factory1.get_test_arts($scope.test_id)
            .then(function(resp) {
                var tbl_entries = adapt_arts(resp.data);
                var ordered_entries = params.filter ? $filter('filter')(tbl_entries, params.filter) : tbl_entries;
                $scope.tbl_data_arts = ordered_entries.slice(
                    (params.page - 1) * params.count,
                    params.page * params.count
                );
            }, function(resp) {
                data_factory1.handle_error(resp, [404]);
            });
    }, true);
});
