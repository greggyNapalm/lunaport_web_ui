/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers, app */
'use strict';

app.controller('TestDetailStatisticsCtrl', function TestsCtrl(
    $scope, $filter, $routeParams,
    ngTableParams,
    util, data_factory1) {

    // responce distr 
    var adap_rest_test_stat_resp_to_tbl = function(stat) {
        var retval = [];
        var prev_quantile = 0;
        for (var idx in stat.num) {
            var quantile = parseInt(stat.quantiles[idx], 10);
            retval.push({
                'quantile': quantile,
                'quantile_pp': [prev_quantile, ' — ', quantile].join(''),
                'count': parseInt(stat.num[idx], 10),
                'percentage': parseFloat(stat.percentages[idx]),
                'percentile': parseFloat(stat.percentiles[idx]),
            });
            prev_quantile = quantile;
        }
        return retval;
    };
    var handl_resp_stat = function(params, stat) {
    /* Sort and slice adapted REST resource(Responce time distr table).
    */
        var tbl_entries = adap_rest_test_stat_resp_to_tbl(stat);
        var ordered_entries = params.sorting ? $filter('orderBy')(tbl_entries, params.orderBy()) : tbl_entries;
        return ordered_entries.slice(
            (params.page - 1) * params.count,
            params.page * params.count
        );
    };

    //main
    $scope.popover = {
        'user_quantiles': CONST.get('user_quantiles_popover'),
        'standart_percentiles': CONST.get('standart_percentiles_popover'),
        'errno': CONST.get('errno_popover'),
        'http_status': CONST.get('http_popover'),
        'rtt_fracts': CONST.get('rtt_fracts_popover'),
    };
    $scope.loading = true;
    $scope.test_id = $routeParams.test_id;
    $scope.curr_tag = $routeParams.ammo_tag;
    $scope.test_stat = null;

    $scope.tbl_resp_distr_usr = new ngTableParams({
        page: 1,            // show first page
        total: 0,           // length of data
        count: 10,          // count per page
        sorting: {
            quantile: 'desc'     // initial sorting
        }
    });
    $scope.tbl_resp_distr_standart = new ngTableParams({
        page: 1,            // show first page
        total: 11,           // length of data
        count: 12,          // count per page
        counts: [],
        sorting: {
            quantile: 'desc'     // initial sorting
        }
    });

    data_factory1.get_test_stat($scope.test_id, $scope.curr_tag)
        .then(function(resp) {
            $scope.test_stat = resp.data;
            $scope.loading = 'done';
        }, function(resp) {
            if (resp.status == 404) {
                $scope.loading = 'missing';
            } else {
                data_factory1.handle_error(resp, [404]);
            }
        });


    $scope.$watch('[tbl_resp_distr_usr, test_stat]', function(values) {
        if (values[1]) {
            if ($scope.test_stat.doc.resp_cfg_q) {
                $scope.tbl_data_resp_distr_usr = handl_resp_stat(values[0], $scope.test_stat.doc.resp_cfg_q);
                $scope.tbl_resp_distr_usr.total = $scope.test_stat.doc.resp_cfg_q.num.length;
            } else {
                $scope.user_quantiles_missing = true; 
            }
        }
    }, true);

    $scope.$watch('[tbl_resp_distr_standart, test_stat]', function(values) {
        if (values[1]) {
            $scope.tbl_data_resp_distr_standart = handl_resp_stat(values[0], $scope.test_stat.doc.resp_stand_q);
        }
    }, true);

    // http status codes distr 
    var handl_resp_codes = function(params, stat) {
        /* Sort and slice adapted REST resource(Responce time distr table).
        */
        var tbl_entries = stat;
        var ordered_entries = params.sorting ? $filter('orderBy')(tbl_entries, params.orderBy()) : tbl_entries;
        return ordered_entries.slice(
            (params.page - 1) * params.count,
            params.page * params.count
        );
    };
    $scope.tbl_status_codes_distr = new ngTableParams({
        page: 1,            // show first page
        total: 21,           // length of data
        count: 22,          // count per page
        counts: [],
        sorting: {
            code: 'desc'     // initial sorting
        }
    });
    $scope.$watch('[tbl_status_codes_distr, test_stat]', function(values) {
        if (values[1]) {
            $scope.tbl_data_status_codes_distr = handl_resp_codes(values[0], $scope.test_stat.doc.http_status_distr);
        }
    }, true);

    // errno codes distr 
    $scope.tbl_errno_distr = new ngTableParams({
        page: 1,            // show first page
        total: 21,           // length of data
        count: 22,          // count per page
        counts: [],
        sorting: {
            code: 'desc'     // initial sorting
        }
    });
    $scope.$watch('[tbl_errno_distr, test_stat]', function(values) {
        if (values[1]) {
            $scope.tbl_data_errno_distr = handl_resp_codes(values[0], $scope.test_stat.doc.errno_distr);
        }
    }, true);
});
