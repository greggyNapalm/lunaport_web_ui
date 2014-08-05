/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, CONST, ya, helpers, app */
'use strict';

app.controller('TestDetailStatisticsTagsCtrl', function TestsCtrl(
    $scope, $filter, $routeParams, $q,
    ngTableParams,
    util, data_factory1) {


    var adap_resp_time_distr = function(stat) {
        var rv = {};
        for (var idx in stat.num) {
            var percentile = parseFloat(stat.percentiles[idx]);
            rv[percentile] = {
                'quantile': parseInt(stat.quantiles[idx], 10),
                'count': parseInt(stat.num[idx], 10),
                'percentage': parseFloat(stat.percentages[idx]),
            };
        }
        return rv;
    };

    var adap_http_status_distr = function(codes) {
        var rv = {};
        for (var idx in codes) {
            rv[codes[idx].code] = codes[idx];
        }
        return rv;
    };

    var adap_errno_distr = function(errnos) {
        var rv = {};
        for (var idx in errnos) {
            rv[errnos[idx].code] = errnos[idx];
        }
        return rv;
    };


    var fetch_tags_stats = function(tags_names) {
        // combine all stat resource calls in one promise
        return $q.all(tags_names.map(function(tag) {
                return data_factory1.get_test_stat($scope.test_id, tag)
                    .then(function(resp) {
                        return resp.data;
                    }, function(resp) {
                        if (resp.status == 404) {
                            $scope.loading = 'missing';
                        } else {
                            data_factory1.handle_error(resp, [404]);
                        }
                    });
            })
        );
    };

    var proc_stats = function(stats) {
        return  stats.map(function(s) {
            return {
                'tag': s.ammo_tag,
                'resp_time': adap_resp_time_distr(s.doc.resp_stand_q),
                'http_status': adap_http_status_distr(s.doc.http_status_distr),
                'errno': adap_errno_distr(s.doc.errno_distr)
            };
        });
    };

    var compose_hdrs = function(stats, rv) {
            var errno_codes = [];
            stats.map(function(s) {
                errno_codes.push.apply(errno_codes, Object.keys(s.errno));
            });
            errno_codes = _.uniq(errno_codes);
            
            $scope.errno_columns = _.uniq(errno_codes).map(function(c) {
                return { title: c, field: c};
            }); 

            var http_codes = [];
            stats.map(function(s) {
                http_codes.push.apply(http_codes, Object.keys(s.http_status));
            });
            //http_codes = _.uniq(http_codes);
            
            $scope.http_columns = _.uniq(http_codes).map(function(c) {
                return { title: c, field: c};
            }); 
        };
    //main
    $scope.popover = {
        'user_quantiles': CONST.get('user_quantiles_popover'),
        'standart_percentiles': CONST.get('standart_percentiles_popover'),
        'errno': CONST.get('errno_popover'),
        'http_status': CONST.get('http_popover'),
        'rtt_fracts': CONST.get('rtt_fracts_popover'),
    };
    $scope.test_id = $routeParams.test_id;

    data_factory1.get_test_ammo_tags($scope.test_id)
        .then(function(resp) {
            $scope.stat_tags = resp.data.available_tags;
            fetch_tags_stats(resp.data.available_tags)
            .then(function(stats) {
                $scope.stats = proc_stats(stats);
                compose_hdrs($scope.stats, $scope);
                //console.dir($scope.stats);
            });
        }, function(resp) {data_factory1.handle_error(resp);});
});
