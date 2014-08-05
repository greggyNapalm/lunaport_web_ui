/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global jQuery, $, _, amplify, angular, CONST, ya, helpers, app */
'use strict';

app.controller('CaseDetailEditCtrl', function CaseDetailEditCtrl(
    $scope, $filter, $routeParams, $location,
    ngTableParams, toaster,
    util, data_factory1, shared) {

    var adapt_case = function(t_case) {
        if (t_case.root_test_id) {
            t_case.root_test_lnk = '/tests/' + t_case.root_test_id  + '/all/';
        } else {
            t_case.root_test_id = '';
            t_case.root_test_id_hldr = 'null';
            t_case.root_test_lnk = '#';
        }
        if (t_case.etalon_test_id) {
            t_case.etalon_test_lnk = '/tests/' + t_case.etalon_test_id  + '/all/';
        } else {
            t_case.etalon_test_id = '';
            t_case.etalon_test_id_hldr = 'null';
            t_case.etalon_test_lnk = '#';
        }
        return t_case;
    };

    var adapt_notifcn = function(case_body, notifcn_body) {
        var default_notifcn = {
            on_start: false,
            on_finish: false,
            on_failed: false
        };
        var rv = {};

        if (!(_.isEmpty(notifcn_body)) && (notifcn_body.hasOwnProperty(0)) && (_.isObject(notifcn_body[0]))) {
            rv = {
                'xmpp': notifcn_body[0].cfg.xmpp,
                'email': notifcn_body[0].cfg.email
            };
        } else {
            rv = {
                xmpp: _.clone(default_notifcn),
                email: _.clone(default_notifcn)
            };
        }
        rv.issue_tracker = _.extend(_.clone(default_notifcn), _.clone(case_body.notification)) || _.clone(default_notifcn);
        return rv;
    };

    var handle_responses = function(case_body, notifcn_body) {
        $scope.notifcn = adapt_notifcn(case_body, notifcn_body);
        $scope.$watch('notifcn', function(old_val, new_val){
            for (var key in $scope.notifcn) {
                if ($scope.notifcn[key] && $scope.notifcn[key].on_finish) {
                    $scope.notifcn[key].on_failed = false;
                }
            }
            if (!(_.isEqual($scope.notifcn.issue_tracker, $scope.t_case.notification))) {
                $scope.diff_ready = true;
                $scope.diff_case_notifcn = true;
            }
            if (_.isEqual(new_val.xmpp, old_val.xmpp) && _.isEqual(new_val.email, old_val.email)) {
                return null;
            }
            $scope.diff_ready = true;
            $scope.diff_user_notifcn = true;
        }, true);
    };


    function fetch_case(case_id) {
        data_factory1.get_case(case_id)
            .then(function(resp) {
                $scope.t_case = adapt_case(resp.data);
            }, function(resp) {data_factory1.handle_error(resp);});
    }
    $scope.patch_case = function() {
        if ($scope.diff_case_notifcn) {
            $scope.diff.notification = $scope.notifcn.issue_tracker; 
            $scope.diff_case = true;
        }

        if ($scope.diff_case) {
            data_factory1.patch_case($scope.case_id, $scope.diff)
                .then(function(resp) {
                    toaster.pop('success', "case resource", "successfully updated");
                    $scope.diff = {};
                    $scope.diff_ready = false;
                    $scope.diff_case_notifcn = false;
                }, function(resp) {data_factory1.handle_error(resp);});
        }

        if ($scope.diff_user_notifcn) {
            var cfg = _.omit($scope.notifcn, 'issue_tracker');
            if ($scope.user_notifcn_missing) {
                data_factory1.post_notification($scope.t_case.name, $scope.usr_settings.login, cfg)
                    .then(function(resp) {
                        toaster.pop('success', "notification resource", "successfully created");
                        $scope.diff = {};
                        $scope.diff_ready = false;
                        $scope.diff_case_notifcn = false;
                        $scope.diff_user_notifcn = false;
                    }, function(resp) {data_factory1.handle_error(resp);});
            } else {
                data_factory1.patch_notification($scope.t_case.name, $scope.usr_settings.login, cfg)
                    .then(function(resp) {
                        toaster.pop('success', "notification resource", "successfully updated");
                        $scope.diff = {};
                        $scope.diff_ready = false;
                        $scope.diff_case_notifcn = false;
                        $scope.diff_user_notifcn = false;
                    }, function(resp) {data_factory1.handle_error(resp);});

            }
        }
    };

    $scope.ace_changed = function() {
        $scope.editor.is_changed++;
    };

    $scope.ace_loaded = function(_editor) {
        $scope.editor.obj = _editor;
        $scope.editor.is_ready = true;
    };

    // main
    $scope.user = {
        name: 'awesome user'
    };  
    $scope.popover = {
        'oracle': CONST.get('oracle_popover')
    };

    $scope.usr_settings = shared.get('usr_settings');
    $scope.case_id = $routeParams.case_id;
    $scope.t_case = null;
    $scope.editor = {
        'obj': null,
        'ready_to_save': 0,
        'is_changed': 0
    };

    //var case_data_promise = data_factory1.get_case($scope.case_id)
    data_factory1.get_case($scope.case_id)
        .then(function(case_resp) {
            $scope.t_case = adapt_case(case_resp.data);
            data_factory1.get_notification($scope.t_case.name, $scope.usr_settings.login)
                .then(function(notifcn_resp) {
                    handle_responses(case_resp.data, notifcn_resp.data);
                }, function(resp) {
                    if (resp.status === 404) {
                        $scope.user_notifcn_missing = true;
                        handle_responses(case_resp.data, {});
                    }
                    data_factory1.handle_error(resp, [404]);
                });

        }, function(resp) {data_factory1.handle_error(resp);});


    $scope.$watch('[t_case, editor.is_ready]', function(newValues){
        if (newValues[0]){
            $scope.t_case.oracle_str_orig = JSON.stringify($scope.t_case.oracle, null, "  ");
            $scope.editor.obj.setValue($scope.t_case.oracle_str_orig, -1);
            $scope.ace_height = $scope.editor.obj.getSession().getDocument().getLength() * $scope.editor.obj.renderer.lineHeight + $scope.editor.obj.renderer.scrollBar.getWidth();
        }
    }, true);

    $scope.$watch('[t_case, editor.is_changed]', function(value){
        var diff = {};
        var diff_ready = false;
        if (($scope.case_form.$valid) && ($scope.case_form.$dirty)) {
            if ($scope.case_form.root_test.$dirty && $scope.case_form.root_test.$viewValue) {
                _.extend(diff, {'root_test_id': $scope.case_form.root_test.$viewValue});
            }
            if ($scope.case_form.etalon_test.$dirty && $scope.case_form.etalon_test.$viewValue) {
                _.extend(diff, {'etalon_test_id': $scope.case_form.etalon_test.$viewValue});
            }
            if ($scope.case_form.descr.$dirty ){
                _.extend(diff, {'descr': $scope.case_form.descr.$viewValue});
            }
        }
        if ($scope.editor.is_changed > 0) {
            try {
                var ora_obj =  jQuery.parseJSON($scope.editor.obj.getValue());
                var ora_str = JSON.stringify(ora_obj);
                _.extend(diff, {'oracle': ora_str});
            } catch(err) {
                return null;
            }
        }
        if (_.isEmpty((diff))) {
           diff_ready = false; 
        } else {
           diff_ready = true; 
           $scope.diff_case = true;
        }
        $scope.diff = diff;
        $scope.diff_ready = diff_ready;
    }, true);
});
