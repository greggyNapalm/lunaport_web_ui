/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers, app */
'use strict';

app.controller('CaseDetailCtrl', function TestsCtrl(
    $scope, $filter, $http, $routeParams, $location,
    ngTableParams, toaster,
    util, data_factory1) {

    $scope.t_case = null;
    $scope.editor = null;

    $scope.go_to_edit_page = function() {
        $location.path($location.path() + '/edit');
    };
    var adapt_case = function(t_case) {
        if (t_case.root_test_id) {
            t_case.root_test_lnk = '/tests/' + t_case.root_test_id  + '/all/';
        } else {
            t_case.root_test_id = 'null';
            t_case.root_test_lnk = '#';
        }
        if (t_case.etalon_test_id) {
            t_case.etalon_test_lnk = '/tests/' + t_case.etalon_test_id  + '/all/';
        } else {
            t_case.etalon_test_id = 'null';
            t_case.etalon_test_lnk = '#';
        }
        t_case.oracle_pp = JSON.stringify(t_case.oracle, null, "  ");
        return t_case;
    };
    function fetch_case(case_id) {
        data_factory.get_case(case_id)
            .success(function(data, status, headers, config) {
                $scope.t_case = adapt_case(data);
            })
            .error(function (data, status, headers, config) {
                if (status === 0) {
                    toaster.pop('warning', "API call failed", "Network connectivity problems");
                }
            });
    }
    fetch_case($routeParams.case_id);
    $scope.aceLoaded = function(_editor) {
        $scope.editor = _editor;
        $scope.editor_reday = true;
    };
});
