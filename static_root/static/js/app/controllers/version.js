/* JSHint strict mode tweak */
/*jshint globalstrict: true*/
/*jshint browser: true*/
/*global $, _, angular, CONST, ya, helpers, app */
'use strict';

app.controller('VersionCtrl', function VersionCtrl($scope, $http, $q, RuntimeCache) {
    $scope.client_version = {
        'env': CONST.get('ENVIRONMENT'),
        'tag': CONST.get('TAG')
    };
    var result = RuntimeCache.get('srv_ver');
    if (result) {
        $scope.srv = result;
    } else {
        $http.get('/api/version').
            success(function(data, status, headers, config) {
                $scope.srv = data;
                RuntimeCache.put('srv_ver', data);
            }).
            error(function(data, status, headers, config) {
                if (status == 401) {
                    console.info('Could not authenticate you.');
                    ya.redirectToAuth();
                } else {
                    console.info('Auth call failed.');
                }
            });
    }
});
