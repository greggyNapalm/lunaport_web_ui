/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';

var rest_issue_mixin = new REST_resource_mixin(); 
rest_issue_mixin.get_issue =  function (issue_name) {
    if (typeof issue_name === 'undefined') throw this.req_msg + '*issue_name*';

    return this.http_call({
        method: 'GET',
        url: this.url_base + 'issue/' + issue_name
    });
};

rest_issue_mixin.post_issue =  function (issue_name, autocomplete, retries_num) {
    if (typeof issue_name === 'undefined') throw this.req_msg + '*issue_name*';

    var body = {
        'name': issue_name
    };
    return this.http({
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        url: this.url_base + 'issue/',
        data: body,
    });
};
