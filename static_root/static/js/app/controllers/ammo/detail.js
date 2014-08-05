/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers, app */
'use strict';

app.controller('AmmoDetailCtrl', function AmmoDetailCtrl(
    $scope, $filter, $routeParams, $location,
    ngTableParams, toaster,
    util, data_factory1, shared) {

    var adapt_ammo = function(ammo) {
        ammo.avatarUrl = ya.getAvatarLink(ammo.owner);
        ammo.added_at_pp = util.utc_to_tbl(ammo.added_at);
        return ammo;
    };

    // main
    $scope.ammo_id = $routeParams.ammo_id;
    $scope.ammo_hash = $routeParams.ammo_hash;

    $scope.test_lst_fillter = {
        'ammo': $scope.ammo_id
    };

    if ($scope.ammo_id != 'null') {
        data_factory1.get_ammo($scope.ammo_id)
            .then(function(resp) {
                $scope.ammo = adapt_ammo(resp.data);
            }, function(resp) {
                data_factory1.handle_error(resp);
            });
    };
    if ($scope.ammo_hash && 0 ==! $scope.ammo_hash.length) {
        data_factory1.get_ammo_by_hash($scope.ammo_hash)
            .then(function(resp) {
                $location.path('/ammo/' + parseInt(resp.data.pop().id, 10) + '/');
            }, function(resp) {
                data_factory1.handle_error(resp);
            });
    };
});
