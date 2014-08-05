/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global jQuery, $, _, amplify, angular, CONST, ya, helpers, app */
'use strict';

app.controller('HooksCtrl', function HooksCtrl(
    $scope, $filter, $routeParams, $location,
    ngTableParams, toaster,
    util, data_factory1, shared) {


    var adapt_hook_reg = function(hook_reg) {
        hook_reg.cfg_txt = JSON.stringify(hook_reg.cfg); 
        hook_reg.ready_to_submit = false;
        return hook_reg;
    };

    var validate_hook_reg = function(hook_reg) {
        try {
            hook_reg.cfg =  jQuery.parseJSON(hook_reg.cfg_txt);
            hook_reg.is_ready_to_submit = true;
            hook_reg.is_cfg_malformed = false;
        } catch(err) {
            hook_reg.is_ready_to_submit = false;
            hook_reg.is_cfg_malformed = true;
        }
        return hook_reg;
    };

    $scope.patch_hook_reg = function(idx) {
        $scope.hooks_regs[idx].loading = true; 
        var h_rg = $scope.hooks_regs[idx]; 
        var diff = {
            'cfg': h_rg.cfg, 
            'is_enabled': h_rg.is_enabled
        };
        data_factory1.patch_hook_registration(h_rg.id, diff)
            .then(function(resp) {
                $scope.hooks_regs[idx].loading = false; 
                $scope.hooks_regs[idx].is_ready_to_submit = false;
                toaster.pop('success', "hook registration", "successfully updated");
            }, function(resp) {
                data_factory1.handle_error(resp);
            });
    };
    $scope.post_hook_reg = function() {
        $scope.new_hook_reg.loading = true; 
        var doc = {
            'cfg': $scope.new_hook_reg.cfg, 
            'is_enabled': $scope.new_hook_reg.is_enabled
        };
        data_factory1.post_hook_registration($scope.case_id, $scope.selected_hook_type.id, doc)
            .then(function(resp) {
                $scope.new_hook_reg.loading = false;
                $scope.new_hook_reg.is_ready_to_submit = false;
                toaster.pop('success', "hook registration", "successfully created");
                fetch_h_regs($scope.case_id);
            }, function(resp) {
                $scope.new_hook_reg.loading = false;
                $scope.new_hook_reg.is_ready_to_submit = false;
                data_factory1.handle_error(resp);
            });
    };

    $scope.delete_hook_reg = function(idx) {
        var h_rg = $scope.hooks_regs[idx]; 
        data_factory1.delete_hook_registration(h_rg.id)
            .then(function(resp) {
                delete $scope.hooks_regs[idx];
                fetch_h_regs($scope.case_id);
            }, function(resp) {
                data_factory1.handle_error(resp);
            });
    };

    function fetch_h_regs(case_id) {
    return data_factory1.get_hook_registrations(case_id)
        .then(function(resp) {
            $scope.hooks_regs = _.map(resp.data, adapt_hook_reg);
            $scope.flags.hooks_regs_was_found = true;
        }, function(resp) {
            if (resp.status === 404) {
                $scope.flags.hooks_regs_was_found = false;
            }
            data_factory1.handle_error(resp, [404]);

        });
    }

    // main
    $scope.flags = {};
    //$scope.flags = {'no_registered_hooks': false};
    $scope.case_id = $routeParams.case_id;
    $scope.new_hook_reg = adapt_hook_reg({
        //'cfg_txt': '{"this is": "a json doc"}',
        'cfg': {"this is": "a json doc"},
        'is_enabled': true
    });

    data_factory1.get_hooks()
        .then(function(resp) {
            $scope.hooks = resp.data;
            $scope.selected_hook_type = $scope.hooks[0];
        }, function(resp) {
            data_factory1.handle_error(resp);
        });

    fetch_h_regs($scope.case_id);
    $scope.$watch('hooks_regs', function(new_value, prev_value){
        if (!(new_value && prev_value)) {
            return null;
        }
        for(var idx=0, len=new_value.length; idx < len; idx++){
            var prev_val = _.filter(prev_value, function(r){
                return r && new_value[idx] && (r.id == new_value[idx].id);
            });
            var is_changed = false;
            if (prev_val.length == 1) {
                if (new_value[idx].cfg_txt != prev_val[0].cfg_txt) {
                    is_changed = true;
                } else if (new_value[idx].is_enabled != prev_val[0].is_enabled) {
                    is_changed = true;
                } else {
                    is_changed = false;
                }
                if (is_changed) {
                    $scope.hooks_regs[idx] = validate_hook_reg($scope.hooks_regs[idx]);
                }
            } else { // new value, no cahnges.
                if ($scope.hooks_regs[idx]) {
                    $scope.hooks_regs[idx] = _.extend($scope.hooks_regs[idx], {
                        is_ready_to_submit: false,
                        is_cfg_malformed: false
                    });
                }
            }
        }
    }, true);
    $scope.$watch('new_hook_reg', function(new_values, prev_values){
        if (!($scope.new_hook_reg_form.$dirty)) {
            return null;
        }
        $scope.new_hook_reg = validate_hook_reg($scope.new_hook_reg);
    }, true);

});
