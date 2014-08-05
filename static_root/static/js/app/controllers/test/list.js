/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers, app */
'use strict';

app.controller('TestListCtrl', function TestsCtrl(
    $scope, $routeParams,
    ngTableParams, $modal,
    util, data_factory1, AlertService, shared) {

    $scope.update_fillter = function(fillter_param)
    {
         $scope.fillter = fillter_param;
    };

    var api_tests_to_tbl = function(tests_doc) {
        /* Translate retrieved from API data to ng-table format. */
        var retval = [];
        for (var idx in tests_doc) {
            retval.push({
                'id': tests_doc[idx].id,
                'name': tests_doc[idx].name,
                'status': tests_doc[idx].status,
                'initiator': tests_doc[idx].initiator,
                'avatarUrl': ya.getAvatarLink(tests_doc[idx].initiator), 
                'case': tests_doc[idx]['case'].name,
                'issue': tests_doc[idx].issue,
                'finished_at': util.utc_to_tbl(tests_doc[idx].finished_at),
                'resolution': tests_doc[idx].resolution
            });
        }
        return retval;
    };
    $scope.testLstTbl = {
        fillter: {},
        update_trigger: 0,
        defaultURL: '/api/latest/tests/',
        currentPage: 1,  // starts from 1
        perPage: 10,
        noOfPages: 2,
        content: [],
        nextBtnClass: null,
        prevBtnClass: null,
        fetch_tests: fetch_tests,
        goNext: function(){
            this.link.next && fetch_tests(this.link.next.url);
        },
        goPrev: function(){
            this.link.prev && fetch_tests(this.link.prev.url);
        },
        perPageChange: function(){
            this.fetch_tests(undefined, this.perPage, this.fillter);
        }
    };
    function fetch_tests(url, per_page, fillter) {
        data_factory1.get_tests(url, per_page, fillter).then(
            function(resp) {
                if ($scope.embedded && !fillter) {
                    // Test table embedded in some page and fillter doesn't populated yet
                    return false; 
                }
                $scope.testLstTbl.content = api_tests_to_tbl(resp.data);
                $scope.testLstTbl.link = helpers.parseLinkHeader(resp.headers().link);
                if ($scope.testLstTbl.link && 'next' in $scope.testLstTbl.link) {
                    $scope.testLstTbl.nextBtnClass = null;
                } else {
                    $scope.testLstTbl.nextBtnClass = 'disabled';
                }
                if ($scope.testLstTbl.link && 'prev' in $scope.testLstTbl.link) {
                    $scope.testLstTbl.prevBtnClass = null;
                } else {
                    $scope.testLstTbl.prevBtnClass = 'disabled';
                }
            }, function(resp) {
                if (resp.status === 404) {
                    $scope.testLstTbl.content = []; 
                }
            });
    }
    $scope.testLstTblPager = {
      'ctrl+right': function() { $scope.testLstTbl.goNext(); },
      'ctrl+left': function() { $scope.testLstTbl.goPrev(); }
    };

    // main
    $scope.show_repeat_dialog = 0;
    $scope.init = function(embedded)
    {
        $scope.embedded = embedded;
    };

    var create_dialog_state = 'start';
    var lunapark_test_id = 0;
    var TestCreateModalCtrl = function ($scope, $modalInstance) {
        $scope.create_dialog_state = create_dialog_state;
        $scope.lunapark_test_id = lunapark_test_id;

        $scope.change_state = function (state) {
            $scope.create_dialog_state = state;
            if (state == 'new') {
                $scope.$parent.show_repeat_dialog = $scope.$parent.show_repeat_dialog + 1;
                $modalInstance.close();
            }
        };
        $scope.ok = function () {
            $modalInstance.close();
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    $scope.open_test_create_modal = function() {
        var modalInstance = $modal.open({
          scope: $scope,
          templateUrl: '/static/tmpl/test/create_modal.html',
          controller: TestCreateModalCtrl,
          windowClass: 'modal-load-cfg',
          resolve: {
            token_descr: function () {
              return $scope.token_descr;
            }
          }
        });
        shared.set('test_create_modal', modalInstance);
    };

    fetch_tests();
    $scope.$watch('testLstTbl.perPage', function(newVal, oldVal) {
        if (newVal != oldVal) {
            $scope.testLstTbl.perPageChange(newVal);
        }
    }, true);
    $scope.$watch('$parent.test_lst_fillter', function(newVal, oldVal) {
        if (newVal) {
            $scope.testLstTbl.fillter = newVal;
            $scope.testLstTbl.perPageChange();
        }
    }, true);
});
