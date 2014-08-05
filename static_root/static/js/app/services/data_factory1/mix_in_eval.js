/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';

var rest_eval_mixin = new REST_resource_mixin(); 
rest_eval_mixin.get_evals =  function (url, test_id, per_page) {
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
        url = [this.url_base + 'eval/', $.param(params)].join('?');
    }
    return this.http_call({
        method: 'GET',
        url: url
    });
};

rest_eval_mixin.get_eval =  function (eval_id) {
    if (typeof eval_id === 'undefined') throw this.req_msg + '*eval_id*';
    return this.http_call({
        method: 'GET',
        url: this.url_base + 'eval/' + eval_id 
    });

};
