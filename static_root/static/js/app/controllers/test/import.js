/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers, app */
'use strict';


app.controller('TestImportCtrl', function TestImportCtrl(
    $scope, $routeParams, $anchorScroll, $filter, $http, $location,
    ngTableParams, toaster, $upload,
    util, data_factory1, shared) {

    _.mixin(_.str.exports());
    
    // main
    $scope.upload_error = {};
    $scope.dynamic = 0;
    $scope.load_src = 'EXAMPLE.COM';

    data_factory1.get_case_names_butch()
        .then(function(resp) {
            $scope.case_names_butch = _.map(resp.data,
                                            function(el){ return {'id': el[0], 'name': el[1]}; });
        }, function(resp) {data_factory1.handle_error(resp);});

    data_factory1.get_host_names_butch()
        .then(function(resp) {
            $scope.host_names_butch = resp.data;
        }, function(resp) {data_factory1.handle_error(resp);});

    $scope.cretae_with_arts = function() {
        if (typeof $scope.files_to_upload === 'undefined') {
            $scope.upload_error = {
                'trigger': true,
                'error_text': 'Files to upload not defined',
            }
            return null;
        }
        $scope.upload = $upload.upload({
         url: '/api/latest/tests/',
          data: {
              'env': 'yandex-tank',
              'autocomplete': true,
              'load_src': $scope.load_src,
              'case': $scope.t_case,
          },
          file: $scope.files_to_upload,
        }).progress(function(evt) {
          $scope.dynamic = parseInt(100.0 * evt.loaded / evt.total);
        }).success(function(data, status, headers, config) {
          $scope.upload_error.trigger = false;
          toaster.pop('success', 'New test entrie', 'Successfully created');
          $location.path('/tests/' + parseInt(data.id, 10) + '/all');
        }).error(function(data, status, headers, config) {
            $scope.upload_error = data;
            $scope.upload_error.trigger = true;
        });
    }; 


    $scope.onFileSelect = function($files) {
            for (var i = 0; i < $files.length; i++) {
                if (_($files[i].name).endsWith(".conf")) {
                    $files[i].fileFormDataName = 'load_cfg'
                } else if (_($files[i].name).endsWith(".log")) {
                    $files[i].fileFormDataName = 'phout'
                } 
            }
            $scope.files_to_upload = $files;
    };
});
