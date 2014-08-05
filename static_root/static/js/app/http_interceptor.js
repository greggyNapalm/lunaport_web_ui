/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, app, ya, helpers */
'use strict';

app.config(['$httpProvider', function($httpProvider) {
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
    $httpProvider.responseInterceptors.push(['$q', function($q) {
        return function(promise) {
            return promise.then(function(response) {
                // on success
                return response; 

            }, function(resp) {
                // on error
                //console.info(response.cofig.retries_num);
                console.info(resp);
                if (resp.config.retries_num <= 0) {
                    return $q.reject(resp);
                }
                var retr_num = resp.config.retries_num++;
                var e = new APIexc(resp);
                if (e.missing_issue()) {
                    //data_factory.post_issue(e.miss_resource, true, retr_num);
                    //console.info('Need to add:', e.miss_resource)
                }
                return $q.reject(resp);
            });
        };
    }]);
}]);
