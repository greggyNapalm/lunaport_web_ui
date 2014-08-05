/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers, app */
'use strict';

app.controller('AmmoListCtrl', function AmmoListCtrl(
    $scope, $location, $modal, $upload, 
    ngTableParams, toaster,
    util, data_factory1) {

    _.mixin(_.str.exports());

    $scope.update_fillter = function(fillter_param)
    {
         $scope.fillter = fillter_param;
    };

    var adapt_ammo_to_tbl = function(ammo) {
        ammo.added_at_pp = util.utc_to_tbl(ammo.added_at);
        return ammo;
    };


    $scope.ammo_lst_tbl = {
        fillter: {},
        current_page: 1,  // starts from 1
        per_page: 10,
        no_of_pages: 2,
        content: [],
        next_btn_class: null,
        prev__btn_class: null,
        fetch_ammos: fetch_ammos,
        go_next: function(){
            this.link.next && fetch_ammos(this.link.next.url);
        },
        go_prev: function(){
            this.link.prev && fetch_ammos(this.link.prev.url);
        },
        on_per_page_change: function(){
            this.fetch_ammos(undefined, this.per_page, this.fillter);
        }
    };

    function fetch_ammos(url, per_page, fillter) {
        data_factory1.get_ammos(url, per_page, fillter)
            .then(function(resp) {
                $scope.ammo_lst_tbl.content = _.map(resp.data, adapt_ammo_to_tbl);
                $scope.ammo_lst_tbl.link = helpers.parseLinkHeader(resp.headers().link);
                if (!$scope.ammo_lst_tbl.link) {
                    $scope.ammo_lst_tbl.pagination = false;
                    $scope.ammo_lst_tbl.next_btn_class = 'disabled';
                    $scope.ammo_lst_tbl.prev_btn_class = 'disabled';
                } else {
                    $scope.ammo_lst_tbl.pagination = true;
                    if ($scope.ammo_lst_tbl.link && 'next' in $scope.ammo_lst_tbl.link) {
                        $scope.ammo_lst_tbl.next_btn_class = null;
                    } else {
                        $scope.ammo_lst_tbl.next_btn_class = 'disabled';
                    }
                    if ($scope.ammo_lst_tbl.link && 'prev' in $scope.ammo_lst_tbl.link) {
                        $scope.ammo_lst_tbl.prev_btn_class = null;
                    } else {
                        $scope.ammo_lst_tbl.prev_btn_class = 'disabled';
                    }
                }
            }, function(resp) {
                if (resp.status == 404) {
                    $scope.ammo_lst_tbl.content = [];
                    $scope.ammo_lst_tbl.next_btn_class = 'disabled';
                    data_factory1.handle_error(resp, [404]);  //No warning on 404 statsu code
                } else {
                    data_factory1.handle_error(resp);
                }
            });
    }
    $scope.ammo_lst_tbl_pager = {
      'ctrl+right': function() { $scope.ammo_lst_tbl.go_next(); },
      'ctrl+left': function() { $scope.ammo_lst_tbl.go_prev(); }
    };

    // main
    $scope.a_post_loading = false;
    $scope.files_to_upload = null;
    $scope.new_ammo = {};
    $scope.upload_error = {};
    fetch_ammos();
    data_factory1.get_case_names_butch()
        .then(function(resp) {
            $scope.case_names_butch = _.map(resp.data,
                                            function(el){ return {'id': el[0], 'name': el[1]}; });
        }, function(resp) {data_factory1.handle_error(resp);});

    var AmmoNewModalCtrl = function ($scope, $modalInstance) {
        $scope.ok = function () {
            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.create_ammo = function() {
            if (typeof $scope.files_to_upload === 'undefined') {
                $scope.upload_error = {
                    'trigger': true,
                    'error_text': 'Files to upload not defined',
                }
                return null;
            }
            $scope.a_post_loading = true;
            $scope.upload = $upload.upload({
             url: '/api/latest/ammo/',
              data: {
                  'case': $scope.new_ammo.t_case,
                  'descr': $scope.new_ammo.descr
              },
              file: $scope.files_to_upload,
            }).progress(function(evt) {
                $scope.dynamic = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function(data, status, headers, config) {
                $scope.a_post_loading = false;
                $scope.upload_error.trigger = false;
                toaster.pop('success', 'New test entrie', 'Successfully created');
                $scope.ok();
                $location.path('/ammo/' + parseInt(data.id, 10) + '/');
            }).error(function(data, status, headers, config) {
                $scope.a_post_loading = false;
                if (_.str.include(data.error_text, 'ammo file exists')) {
                    data.existing_ammo_hash = _.last(_.words(data.error_text));
                    data.existing_ammo_lnk = '/ammo/null/' + _.last(_.words(data.error_text));
                };
                $scope.upload_error = data;
                $scope.upload_error.trigger = true;
            });
        }; 
    };

    $scope.open_ammo_new_modal = function() {
        var modalInstance = $modal.open({
          scope: $scope,
          templateUrl: '/static/tmpl/ammo/new_modal.html',
          controller: AmmoNewModalCtrl,
          windowClass: 'modal-load-cfg'
        });
    };

    $scope.err_additional = function() {
        return _.has($scope.upload_error, 'existing_ammo_lnk');
    };
    $scope.on_file_select = function($files) {
        if ($files.length == 1) {
            $files[0].fileFormDataName = 'ammo';
            $scope.files_to_upload = $files;
        }
    };

    $scope.$watch('ammo_lst_tbl.per_page', function(new_val, old_val) {
        if (new_val != old_val) {
            $scope.ammo_lst_tbl.on_per_page_change(new_val);
        }
    }, true);

    $scope.$watch('$parent.ammo_lst_fillter', function(newVal, oldVal) {
        if (newVal) {
            $scope.ammo_lst_tbl.fillter = newVal;
            $scope.ammo_lst_tbl.on_per_page_change();
        }
    }, true);
});
