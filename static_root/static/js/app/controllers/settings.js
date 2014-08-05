/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers, app */
'use strict';

app.controller('SettingsCtrl', function SettingsCtrl(
    $scope, $http, $location, $modal, $log,
    RuntimeCache, shared, data_factory1) {
    _.mixin(_.str.exports());

    $scope.isActive = function (viewLocation) { 
        return _($location.path()).startsWith(viewLocation);
    };

    $scope.clearCache = function() {
        for (var key in amplify.store()) {
            amplify.store(key, null);
        }
    };

    $scope.open_token_modal = function() {
        var modalInstance = $modal.open({
          templateUrl: '/static/tmpl/settings_token.html',
          controller: TokenModalCtrl,
          resolve: {
            token_descr: function () {
              return $scope.token_descr;
            }
          }
        });
    };
    $scope.delete_token = function(token_id) {
        data_factory1.delete_token(token_id)
            .then(function(resp) {
                fetch_tokens();
            }, function(resp) {data_factory1.handle_error(resp);});
    };
    var fetch_tokens = function() {
        data_factory1.get_tokens()
            .then(function(resp) {
                $scope.tokens = resp.data;
            }, function(resp) {
                if (resp.status === 404) {
                    $scope.tokens = [];
                    // user have no tokens yet
                }
                data_factory1.handle_error(resp, [404]);
            });
    };


    // main
    var result = RuntimeCache.get('usr_settings') || amplify.store('usr_settings');
    if (result) {
        $scope.usr_settings = result;
        shared.set('usr_settings', result);
    } else {
        $http.get('/api/latest/userident').
            success(function(data, status, headers, config) {
                result = data;
                result.fetched_at = Date();
                result.avatar_url = ya.getAvatarLink(data.login);
                result.logoutLink = ya.getLogoutLink();

                $scope.usr_settings = result;
                RuntimeCache.put('usr_settings', result);
                amplify.store('usr_settings', result);
                shared.set('usr_settings', result);
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
    fetch_tokens();

    var TokenModalCtrl = function ($scope, $modalInstance) {
      $scope.token_posted = false;
      $scope.token_descr = null;
      $scope.ok = function (token_descr) {
        if ($scope.token_posted == true) {
            $modalInstance.close();
        } else {
            data_factory1.post_token(token_descr)
                .then(function(resp) {
                    $scope.token_posted = true;
                    $scope.token = resp.data;
                    fetch_tokens();
                }, function(resp) {data_factory1.handle_error(resp);});
        }
      };
      $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
      };
    };
});
