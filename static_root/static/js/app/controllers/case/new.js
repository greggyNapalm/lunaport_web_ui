/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global jQuery, $, _, amplify, angular, ya, helpers, app */
'use strict';

app.controller('CaseNewCtrl', function CaseNewCtrl(
    $scope, $filter, $routeParams, $location,
    ngTableParams, toaster,
    util, data_factory1, shared) {


    var fix_height = function(editor) {
        $scope.ace_height = editor.getSession().getDocument().getLength() * editor.renderer.lineHeight + editor.renderer.scrollBar.getWidth();
    };

    $scope.post_resources = function() {
        var case_body = _.pick($scope.t_case, 'name', 'descr', 'etalon_test_id', 'etalon_test_id', 'oracle', 'notification');
        case_body.oracle = $scope.oracle_verified; 

        data_factory1.post_case(case_body)
            .then(function(resp) {
                toaster.pop('success', "case resource", "successfully created");
                $scope.diff = {};
                $scope.ready_to_submit = false;
                $location.path('/cases/' + parseInt(resp.data.id, 10));
            }, function(resp) {data_factory1.handle_error(resp);});
    };

    $scope.ace_changed = function() {
        $scope.editor.is_changed++;
    };

    $scope.ace_loaded = function(_editor) {
        $scope.editor.obj = _editor;
        $scope.editor.is_ready = true;
    };

    // main
    var default_oracle = [{
        "kw": {
               "tag": "all"
           },
           "name": "assert_resp_times_distr",
           "arg": [
               99,
               ">",
               1
           ]
    }];
    var t_case_default = {
        'oracle_pp': JSON.stringify(default_oracle, null, "  ")
    };
    $scope.editor = {
        'obj': null,
        'is_changed': 0
    };
    $scope.usr_settings = shared.get('usr_settings');
    $scope.t_case = _.extend(t_case_default, shared.get('t_case'));

    $scope.$watch('editor.is_ready', function(new_value){
        $scope.editor.obj.setValue($scope.t_case.oracle_pp, -1);
        fix_height($scope.editor.obj);
    }, true);

    $scope.$watch('[t_case, editor.is_changed]', function(value){
        fix_height($scope.editor.obj);
        $scope.editor.obj.resize();

        if (!($scope.case_form.$valid)) {
            $scope.ready_to_submit = false;
            return null;
        }

        if ($scope.editor.is_changed > 0) {
            try {
                var ora_obj =  jQuery.parseJSON($scope.editor.obj.getValue());
                JSON.stringify(ora_obj);
                $scope.oracle_verified = ora_obj;
                $scope.ready_to_submit = true;
            } catch(err) {
                $scope.ready_to_submit = false;
            }
        } else {
            if ($scope.editor.obj.getValue()) {
                $scope.ready_to_submit = true;
                $scope.oracle_verified = jQuery.parseJSON($scope.editor.obj.getValue());
            }
        }
    }, true);
});
