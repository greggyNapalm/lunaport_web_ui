/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, CONST, helpers, app */
'use strict';

app.controller('CaseDetailCtrl', function TestsCtrl(
    $scope, $filter, $routeParams, $location, $modal,
    ngTableParams, toaster,
    util, data_factory1, shared) {

    $scope.go_to_edit_page = function() {
        $location.path($location.path() + '/edit');
    };
    $scope.go_to_case_new_page = function() {
        $location.path('/cases/new');
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
        //rv.issue_tracker = _.extend(_.clone(default_notifcn), _.clone(case_body.notification)) || _.clone(default_notifcn);
        return rv;
    };

    var update_notifcn_user = function(notifcn_body) {
            var rv = {};
            if (!(_.isEmpty(notifcn_body)) && (notifcn_body.hasOwnProperty(0)) && (_.isObject(notifcn_body[0]))) {
                rv = notifcn_body[0].cfg;
            } else {
                rv = {
                    xmpp: _.clone(default_notifcn),
                    email: _.clone(default_notifcn)
                };
            }
            $scope.notifcn_user = rv;
        };

    var handle_responses = function(case_body, notifcn_body) {
        $scope.notifcn = adapt_notifcn(case_body, notifcn_body);
    };

    var update_notifcn_tracker = function(notification) {
        $scope.notifcn_tracker = _.extend(_.clone(default_notifcn), _.clone(notification)) || _.clone(default_notifcn);
    };

    var obj_diff = function diff(obj1, obj2) {
        var result = {};
        $.each(obj1, function (key, value) {
            if (!obj2.hasOwnProperty(key) || obj2[key] !== obj1[key]) {
                result[key] = value;
            }
        });
        return result;
    };

    var CaseModalBadgeCtrl = function ($scope, $modalInstance) {
        var badge_snippets = util.badge_snippet(window.location.hostname, $scope.t_case.id);
        //console.info(badge_snippets);
        $scope.statuses = [{
            id: 1,
            name: "Wiki", 
            snippets: badge_snippets.wiki
        }, {
            id: 3,
            name: "Markdown", 
            snippets: badge_snippets.markdown
        }, {
            id: 4,
            name: "RST",
            snippets: badge_snippets.rst
        }, {
            id: 5,
            name: "HTML", 
            snippets: badge_snippets.html
        }];
        $scope.selected_status = 1;            
        $scope.cancel = function () {
            $modalInstance.close();
        };
    };

    $scope.open_modal_badge = function() {
        var modalInstance = $modal.open({
          scope: $scope,
          templateUrl: '/static/tmpl/case/modal_badge.html',
          controller: CaseModalBadgeCtrl,
          windowClass: 'modal-load-cfg'
        });
    };

    // main
    $scope.popover = {
        'oracle': CONST.get('oracle_popover'),
        'root_etalon': CONST.get('root_etalon_test_popover')
    };

    $scope.case_id = $routeParams.case_id;
    $scope.usr_settings = shared.get('usr_settings');
    $scope.t_case = null;
    $scope.waiting = {};
    var default_notifcn = {
        on_start: false,
        on_finish: false,
        on_failed: false
    };

    data_factory1.get_case($scope.case_id)
        .then(function(case_resp) {
            $scope.t_case = adapt_case(case_resp.data);
            shared.set('t_case', $scope.t_case);
            $scope.test_lst_fillter = {
                'case': $scope.t_case.name
            };
            $scope.ammo_lst_fillter = {
                'case': $scope.t_case.name
            };
            update_notifcn_tracker(case_resp.data.notification);
            data_factory1.get_notification($scope.t_case.name, $scope.usr_settings.login)
                .then(function(notifcn_resp) {
                    update_notifcn_user(notifcn_resp.data);
                }, function(resp) {
                    if (resp.status === 404) {
                        $scope.user_notifcn_missing = true;
                        update_notifcn_user({});
                    }
                    data_factory1.handle_error(resp, [404]);
                });

        }, function(resp) {data_factory1.handle_error(resp);});

    $scope.$watch('notifcn_tracker', function(new_value, prev_value){
        if (!(prev_value && new_value)) {
            // value initially changed by data_factory call,
            // We want to catch user input instead.
            return;
        }
        $scope.waiting.issue_tracker = true;
        var case_diff = {
            'notification': new_value
        };
        data_factory1.patch_case($scope.case_id, case_diff)
            .then(function(resp) {
                $scope.waiting.issue_tracker = false;
                update_notifcn_tracker(resp.data.notification);
            }, function(resp) {data_factory1.handle_error(resp);}); 

    }, true);

    $scope.$watch('notifcn_user', function(new_value, prev_value){
        if (!(prev_value && new_value)) {
            // value initially changed by data_factory call,
            // We want to catch user input instead.
            return;
        }
        $scope.waiting.notifcn_user = true;
        if ($scope.user_notifcn_missing) {
            data_factory1.post_notification($scope.t_case.name, $scope.usr_settings.login, new_value)
                .then(function(resp) {
                    $scope.user_notifcn_missing = false;
                    toaster.pop('success', "notification resource", "successfully created");
                    $scope.waiting.notifcn_user = false;
                }, function(resp) {data_factory1.handle_error(resp);});
        } else {
            data_factory1.patch_notification($scope.t_case.name, $scope.usr_settings.login, new_value)
                .then(function(resp) {
                    $scope.waiting.notifcn_user = false;
                }, function(resp) {data_factory1.handle_error(resp);});
        }

    }, true);
});
