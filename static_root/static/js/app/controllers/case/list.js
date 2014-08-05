/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers, app */
'use strict';

app.controller('CaseListCtrl', function TestsCtrl(
    $scope, $location, 
    ngTableParams, toaster,
    util, data_factory1) {

    $scope.go_to_case_new_page = function() {
        $location.path('/cases/new');
    };

    var adapt_case_to_tbl = function(t_case) {
        t_case.changed_at_pp = util.utc_to_tbl(t_case.changed_at);
        return t_case;
    };

    $scope.case_lst_tbl = {
        current_page: 1,  // starts from 1
        per_page: 10,
        no_of_pages: 2,
        content: [],
        next_btn_class: null,
        prev__btn_class: null,
        fetch_cases: fetch_cases,
        go_next: function(){
            this.link.next && fetch_cases(this.link.next.url);
        },
        go_prev: function(){
            this.link.prev && fetch_cases(this.link.prev.url);
        },
        on_per_page_change: function(){
            this.fetch_cases(undefined, this.per_page);
        }
    };

    function fetch_cases(url, per_page) {
        data_factory1.get_cases(url, per_page)
            .then(function(resp) {
                $scope.case_lst_tbl.content = _.map(resp.data, adapt_case_to_tbl);
                $scope.case_lst_tbl.link = helpers.parseLinkHeader(resp.headers().link);
                if (!$scope.case_lst_tbl.link) {
                    // All entries fit in one page/responce.
                    // No pagination needed.
                    $scope.case_lst_tbl.pagination = false;
                    $scope.case_lst_tbl.next_btn_class = 'disabled';
                    $scope.case_lst_tbl.prev_btn_class = 'disabled';
                } else {
                    $scope.case_lst_tbl.pagination = true;
                    if ($scope.case_lst_tbl.link && 'next' in $scope.case_lst_tbl.link) {
                        $scope.case_lst_tbl.next_btn_class = null;
                    } else {
                        $scope.case_lst_tbl.next_btn_class = 'disabled';
                    }
                    if ($scope.case_lst_tbl.link && 'prev' in $scope.case_lst_tbl.link) {
                        $scope.case_lst_tbl.prev_btn_class = null;
                    } else {
                        $scope.case_lst_tbl.prev_btn_class = 'disabled';
                    }
                }
            }, function(resp) {
                if (resp.status == 404) {
                    $scope.case_lst_tbl.next_btn_class = 'disabled';
                    data_factory1.handle_error(resp, [404]);
                } else {
                    data_factory1.handle_error(resp);
                }
            });
    }
    $scope.case_lst_tbl_pager = {
      'ctrl+right': function() { $scope.case_lst_tbl.go_next(); },
      'ctrl+left': function() { $scope.case_lst_tbl.go_prev(); }
    };


    // main
    fetch_cases();
    data_factory1.get_case_names_butch()
        .then(function(resp) {
            $scope.case_names_butch = _.map(resp.data,
                                            function(el){ return {'id': el[0], 'name': el[1]}; });
        }, function(resp) {data_factory1.handle_error(resp);});
    $scope.$watch('case_lst_tbl.per_page', function(new_val, old_val) {
        $scope.case_lst_tbl.on_per_page_change(new_val);
    }, true);
    $scope.on_search_select = function($item, $model, $label) {
        $location.path('/cases/' + $item.id);
    };
});
