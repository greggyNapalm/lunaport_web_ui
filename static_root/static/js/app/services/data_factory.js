/* JSHint strict mode tweak */
/*jshint globalstrict: true*/
/*jshint browser: true*/
/*global $, _, angular, ya, app */
'use strict';

app.factory('data_factory', ['$http', 'AlertService', function($http, AlertService) {
    var url_base = '/api/latest/';
    var data_factory = {
        url_base: url_base,
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        http: $http
    };

    function APIexc (resp) {
        this.resp = resp;
        if (this.resp.data.error_text) {
            this.miss_resource = _.rstrip(
                _.last(this.resp.data.error_text.split(':')),
                '\'');
        }
        this.tokens_in_err_txt = function(tokens) {
            var self = this;
            if (this.resp.data.error_text) {
                return _.any(_.map(tokens, function(token){
                    return _.str.include(self.resp.data.error_text, token);
                }));
            }
            return false;
        };
        this.missing_issue = function() {
            return this.tokens_in_err_txt(['unknown *issue*']);
        };
        this.missing_user = function() {
            var tokens_to_search = [
                'unknown *user*',
                'unknown *reporter*',
                'unknown *assignee*',
                'unknown *initiator*'
            ];
            return this.tokens_in_err_txt(tokens_to_search);
        };
        this.missing_server = function() {
            var tokens_to_search = [
                'unknown *load_src*',
                'unknown *load_dst*'
            ];
            return this.tokens_in_err_txt(tokens_to_search);
        };
        this.missing_proj = function() {
            return this.tokens_in_err_txt(['unknown *project_id*']);
        };
    }

    //data_factory.APIexc = function (resp) {
    //    return new APIexc(resp);
    //};
    data_factory.get_tests = function (url, per_page) {
        /* Retrieve test entries from REST API, infinit data pagination aka
        *  GitHUb api.
        */
        url = url || url_base + 'tests/';
        if(!(_.isUndefined(per_page))) {
            url = url + '?per_page=' + per_page;
        }
        return $http.get(url);
    };
    data_factory.get_evals = function (url, test_id, per_page) {
        /* Retrieve evaluations entries from REST API, infinit data pagination aka
        *  GitHUb api.
        */
        if(typeof(url)==='undefined') {
            if(typeof(test_id) === 'undefined') {
                throw 'Rrequired parameters missing:*case_id*';
            }
            var params = {'test_id': test_id};

            if(!(_.isUndefined(per_page))) {
                params.per_page = per_page;
            }
            url = [url_base + 'eval/', $.param(params)].join('?');
        }

        return $http.get(url);
    };
    data_factory.get_cases = function (url, per_page) {
        /* Retrieve test entries from REST API, infinit data pagination aka
        *  GitHUb api.
        */
        if(typeof(url)==='undefined') {
            url = url_base + 'case/';
        }
        if(!(_.isUndefined(per_page))) {
            url = url + '?per_page=' + per_page;
        }
        return $http.get(url);
    };
    data_factory.create_job = function (name, args, kwargs) {
        /* Create new async job resource.
        */
        for (var idx in arguments.length) {
            if(typeof(arguments[idx])==='undefined') {
                throw 'Rrequired parameters missing';
            }
        }
        var body = {
            'name': name,
            'args': args,
            'kwargs': kwargs
        };
        return $http.post(url_base + 'job/', body);
    };
    data_factory.get_case = function (case_id) {
        /* Fetch test case resource by uniq id.
        */
        if(typeof(case_id) === 'undefined') {
            throw 'Rrequired parameters missing:*case_id*';
        }
        return $http.get(url_base + 'case/' + case_id);
    };
    data_factory.get_issue = function (issue_name) {
        /* Fetch test case resource by uniq id.
        */
        if(typeof(issue_name) === 'undefined') {
            throw 'Rrequired parameters missing:*issue_name*';
        }
        return $http.get(url_base + 'issue/' + issue_name);
    };
    data_factory.post_issue = function (issue_name, autocomplete, retries_num) {
        /* Create new issue entrie.
        */
        if(typeof(issue_name) === 'undefined') {
            throw 'Rrequired parameters missing:*issue_name*';
        }
        var body = {
            'name': issue_name
        };
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            url: url_base + 'issue/',
            data: body,
            retries_num: retries_num,
            autocomplete: autocomplete
        });
    };
    data_factory.post_host = function (fqdn) {
        /* Create new host entrie.
        */
        if(typeof(fqdn) === 'undefined') {
            throw 'Rrequired parameters missing:*fqdn*';
        }
        var body = {
            'fqdn': fqdn
        };
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            url: url_base + 'host/',
            data: body,
            //retries_num: retries_num,
            //autocomplete: autocomplete
        });
    };

    data_factory.post_user = function (login, autocomplete, retries_num) {
        /* Create new user entrie.
        */
        if(typeof(login) === 'undefined') {
            throw 'Rrequired parameters missing:*login*';
        }
        var body = {
            'login': login
        };
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            url: url_base + 'user/',
            data: body,
            retries_num: retries_num,
            autocomplete: autocomplete
        });
    };
    data_factory.post_proj = function (proj_name) {
        /* Create new user entrie.
        */
        if(typeof(proj_name) === 'undefined') {
            throw 'Rrequired parameters missing:*proj_name*';
        }
        var body = {
            'name': proj_name
        };
        return $http({
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            url: url_base + 'proj/',
            data: body,
        });
    };
    data_factory.patch_case = function (case_id, diff) {
        /* PATCH case resource.
        */
        if(typeof(case_id) === 'undefined') {
            throw 'Rrequired parameters missing:*case_id*';
        }
        return $http({
            method: 'PATCH',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            url: url_base + 'case/' + case_id,
            data: diff
        });
    };
    data_factory.get_eval = function (eval_id) {
        /* Fetch single valuation resource by uniq id.
        */
        if(typeof(eval_id) === 'undefined') {
            throw 'Rrequired parameters missing:*eval_id*';
        }
        return $http.get(url_base + 'eval/' + eval_id);
    };
    data_factory.get_test = function (test_id) {
        /* Fetch single test resource by uniq id.
        */
        if(typeof(test_id) === 'undefined') {
            throw 'Rrequired parameters missing:*test_id*';
        }
        return $http.get(url_base + 'tests/' + test_id);
    };
    data_factory.get_test = function (test_id) {
        /* Fetch single test resource by uniq id.
        */
        if(typeof(test_id) === 'undefined') {
            throw 'Rrequired parameters missing:*test_id*';
        }
        return $http.get(url_base + 'tests/' + test_id);
    };
    data_factory.get_test_stat = function (test_id, ammo_tag) {
        /* Fetch single test statistic resource by uniq id.
        */
        if(typeof(test_id) === 'undefined') {
            throw 'Rrequired parameters missing:*test_id*';
        }
        if(typeof(ammo_tag) === 'undefined') {
            throw 'Rrequired parameters missing:*ammo_tag*';
        }
        return $http.get(url_base + 'tests/' + test_id + '/stat/' + ammo_tag);
    };
    data_factory.get_test_ammo_tags = function (test_id) {
        /* Fetch single test ammo_tags.
        */
        if(typeof(test_id) === 'undefined') {
            throw 'Rrequired parameters missing:*test_id*';
        }
        return $http.get(url_base + 'tests/' + test_id + '/stat');
    };
    data_factory.get_test_arts = function (test_id) {
        /* Fetch single test ammo_tags.
        */
        if(typeof(test_id) === 'undefined') {
            throw 'Rrequired parameters missing:*test_id*';
        }
        return $http.get(url_base + 'tests/' + test_id + '/arts');
    };
    data_factory.handle_error = function (data, status, headers, config, muted_codes) {
        /* HTTP and network error handler.
        *  muted_codes - array of ints. HTTP response status codes to ignore.
        */
        if (_.contains(muted_codes, status)) {
            return null;
        }

        var alert_msg = {};
        if (status == 401) {
            alert_msg = {
                type: 'danger',
                msg: 'HTTP Error 401 Unauthorized, redirecting to authentication page' 
            };
            AlertService.prepForBroadcast(alert_msg);
            setTimeout(function () {
                window.location.replace(ya.redirectToAuth());
            }, 3000);
        } else if (status == 502) {
            alert_msg = {
                type: 'danger',
                msg: 'Looks like backend overloaded or down.'
            };
        } else if (status === 0) {
            alert_msg = {
                type: 'danger',
                msg: 'Service unreachable, network connectivity problem.' 
            };
        } else {
            if (_.has(data, "error_type") && _.has(data, "error_text")) {
                alert_msg = {
                    type: 'warning',
                    msg: data.error_type + ': ' + data.error_text
                };
            } else {
                alert_msg = {
                    type: 'warning',
                    msg: 'Service call failed by unknown reason' 
                };
            }
        }
        AlertService.prepForBroadcast(alert_msg);
    };
    data_factory.handle_missing = function (data, status, headers, config) {
        var _config = config;
        if (_config.retries_num <= 0) {
            console.info('max retries');
            data_factory.handle_error(data, status, headers, _config);
        }
        _config.retries_num--;
        var e = new APIexc({'data': data});
        if (e.missing_issue()){
            console.info('auto create issue:', e.miss_resource);
            data_factory.post_issue(e.miss_resource, true, _config.retries_num)
                .success(function() {
                    return $http(_config);
                })
                .error(data_factory.handle_missing);
        } else if (e.missing_user()) {
            console.info('auto create user:', e.miss_resource);
            data_factory.post_user(e.miss_resource)
                .success(function() {
                    return $http(_config);
                })
                .error(data_factory.handle_missing);
        } else if (e.missing_proj()) {
            console.info('auto create proj:', e.miss_resource);
            data_factory.post_proj(e.miss_resource)
                .success(function() {
                    return $http(_config);
                })
                .error(data_factory.handle_error);
        } else if (e.missing_server()) {
            console.info('auto create server:', e.miss_resource);
            data_factory.post_host(e.miss_resource)
                .success(function() {
                    return $http(_config);
                })
                .error(data_factory.handle_error);

        } else {
            console.info('Can\'t catch missing resource');
            console.info(_config.retries_num);
            data_factory.handle_error(data, status, headers, config);
        }
    };
    return data_factory;
}]);
