/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';

app.factory('data_factory1', ['$http', '$q', 'AlertService', 'RuntimeCache', function($http, $q, AlertService, RuntimeCache) {
    var url_base = '/api/latest/';
    var data_factory = {
        url_base: url_base,
        http: $http,
        q: $q,
        AlertService: AlertService,
        cache: RuntimeCache
    };
    _.extend(data_factory, rest_error_handle_mixin1);
    _.extend(data_factory, rest_test_mixin1);
    _.extend(data_factory, rest_job_mixin1);
    _.extend(data_factory, rest_case_mixin1);
    _.extend(data_factory, rest_notification_mixin);
    _.extend(data_factory, rest_eval_mixin);
    _.extend(data_factory, rest_issue_mixin);
    _.extend(data_factory, rest_token_mixin);
    _.extend(data_factory, rest_status_mixin);
    _.extend(data_factory, rest_host_mixin);
    _.extend(data_factory, rest_ammo_mixin1);
    _.extend(data_factory, rest_user_mixin);
    _.extend(data_factory, rest_hook_mixin);

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
    return data_factory;
}]);
function lunaport_api_exc (resp) {
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


function REST_resource_mixin () {
    this.req_msg = 'Rrequired parameters missing: ';
    this.headers = {
        'Content-Type': 'application/json; charset=utf-8'
    };
    this.required_args = function(args_names, args) {
        console.info(arguments);
    };
    this.http_call = function(cfg) {
        /*  */
        var d = this.q.defer();
        this.http(cfg)
            .success(function(data, status, headers, config){
                // TODO: add cache here
                //d.resolve(data, status, headers, config);
                d.resolve({
                    'data': data,
                    'status': status,
                    'config': config,
                    'headers': headers
                });
            }).error(function(data, status, headers, config){
                // TODO: invalidate cache
                d.reject({
                    'data': data,
                    'status': status,
                    'config': config,
                    'headers': headers
                });
            });
        return d.promise;
    };
    this.form_data_obj = function(data) {
        var fd = new FormData();
        angular.forEach(data, function(value, key) {
            fd.append(key, value);
        });
        return fd;
    };
}

app.factory('formDataObject', function() {
    /* Workaround to use HTTP POST multipart with Angularjs. 
    */
    return function(data) {
        var fd = new FormData();
        angular.forEach(data, function(value, key) {
            fd.append(key, value);
        });
        return fd;
    };
});
