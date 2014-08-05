/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers, app */
'use strict';

app.controller('AlertCtrl', function AlertCtrl(
    $scope,
    AlertService) {
    $scope.alerts = [
    ];
    $scope.$on('handleBroadcast', function() {
        $scope.alerts.push(AlertService.message);
    });    
    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
});
