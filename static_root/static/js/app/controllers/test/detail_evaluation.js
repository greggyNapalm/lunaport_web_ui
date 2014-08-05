/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers, app */
'use strict';

app.controller('TestDetailEvaluationCtrl', function TestsCtrl(
    $scope, $filter, $routeParams,
    ngTableParams,
    util, data_factory1) {

    $scope.update_eval_id = function(eval_id) {
        $scope.eval_id = eval_id;
    }; 
    var adapt_eval_to_lst = function(t_eval, id_store) {
        /* Test Evaluations API resource adaptor.
        */
        t_eval.added_at_pp = util.utc_to_tbl(t_eval.added_at);
        return t_eval;
    };

    //main 
    $scope.popover = {
        'evaluantion': CONST.get('evaluantion_popover'),
        'evaluantions_available': CONST.get('evaluantions_available_popover'),
    };

    $scope.test_id = $routeParams.test_id;
    $scope.curr_tag = $routeParams.ammo_tag;

    $scope.eval_loading = true;
    $scope.evals_loading = true;

    $scope.eval_list_tbl = {
        defaultURL: '/api/latest/eval/',
        currentPage: 1,  // starts from 1
        perPage: 10,
        noOfPages: 2,
        content: [],
        last_eval_id: null,
        nextBtnClass: null,
        prevBtnClass: null,
        goNext: function(){
            this.link.next && this.fetchContent(this.link.next.url);
        },
        goPrev: function(){
            this.link.prev && this.fetchContent(this.link.prev.url);
        },
        perPageChange: function(){
            $scope.eval_list_tbl.fetchContent();
        },
        fetchContent: function(url){
            data_factory1.get_evals(url, $scope.test_id, this.perPage)
                .then(function(resp) {
                    $scope.eval_list_tbl.content = _.map(resp.data, adapt_eval_to_lst);
                    $scope.last_eval_id = (Math.max.apply(Math, _.map(resp.data, function(obj){ return parseInt(obj.id, 10); })));
                    $scope.eval_id = $scope.last_eval_id;
                    $scope.eval_list_tbl.link = helpers.parseLinkHeader(resp.headers().link);

                    if (!$scope.eval_list_tbl.link) {
                        // All entries fit in one responce.
                        // No pagination needed.
                        $scope.eval_list_tbl.pagination = false;
                    } else {
                        $scope.eval_list_tbl.pagination = true;
                        if ('next' in $scope.eval_list_tbl.link) {
                            $scope.eval_list_tbl.nextBtnClass = null;
                        } else {
                            $scope.eval_list_tbl.nextBtnClass = 'disabled';
                        }
                        if ('prev' in $scope.eval_list_tbl.link) {
                            $scope.eval_list_tbl.prevBtnClass = null;
                        } else {
                            $scope.eval_list_tbl.prevBtnClass = 'disabled';
                        }
                    }
                    $scope.evals_loading = 'done';
                }, function(resp) {
                    if (status == 404) {
                        $scope.eval_list_tbl.nextBtnClass = 'disabled';
                        $scope.evals_loading = 'missing';
                    }
                    data_factory1.handle_error(resp, [404]);
                });
            },
    };

    $scope.$watch('eval_list_tbl.perPage', function(newVal, oldVal) {
        $scope.eval_list_tbl.perPageChange(newVal);
    }, true);

    // evaluation -> current(last) result
    $scope.tbl_eval = new ngTableParams({
        page: 1,            // show first page
        total: 21,           // length of data
        count: 22,          // count per page
        counts: [],
        sorting: {
            code: 'desc'     // initial sorting
        }
    });

    var adapt_eval = function(t_eval) {
        /* Test Evaluations API resource adaptor to *tbl_eval*.
        */
        t_eval.msg = t_eval.msg.msg || t_eval.msg;
        if ($.isEmptyObject(t_eval.kw)) {
            t_eval.kw = '-';
        }
        return t_eval;
    };

    $scope.$watch('[eval_id, tbl_eval]', function(newValues){
        var eval_id = newValues.shift();
        var params = newValues.pop();
        if (!eval_id) {
            return null;
        }

        data_factory1.get_eval(eval_id)
            .then(function(resp) {
                var tbl_entries = _.map(resp.data.result, adapt_eval);
                var ordered_entries = params.sorting ? $filter('orderBy')(tbl_entries, params.orderBy()) : tbl_entries;
                $scope.tbl_data_eval = ordered_entries.slice(
                    (params.page - 1) * params.count,
                    params.page * params.count
                );
                $scope.eval_loading = 'done';
            }, function(resp) {
                if (status == 404) {
                    $scope.eval_loading = 'missing';
                }
                data_factory1.handle_error(resp, [404]);
            });
    }, true);
});
