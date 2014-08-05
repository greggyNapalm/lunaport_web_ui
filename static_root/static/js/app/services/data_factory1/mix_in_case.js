/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';

var rest_case_mixin1 = new REST_resource_mixin(); 
rest_test_mixin1.get_cases =  function (url, per_page) {
    url = url || this.url_base + 'case/';
    if(!(_.isUndefined(per_page))) {
        url = url + '?per_page=' + per_page;
    }

    return this.http_call({
        method: 'GET',
        url: url
    });
};

rest_case_mixin1.get_case =  function (case_id) {
    if (typeof case_id === 'undefined') throw this.req_msg + '*case_id*';

    return this.http_call({
        method: 'GET',
        url: this.url_base + 'case/' + case_id
    });
};

rest_case_mixin1.get_case_names_butch =  function () {
    return this.http_call({
        method: 'GET',
        url: this.url_base + 'case/?names_butch=true'
    });
};


rest_case_mixin1.patch_case =  function (case_id, diff) {
    if (typeof case_id === 'undefined') throw this.req_msg + '*case_id*';
    if (typeof diff === 'undefined') throw this.req_msg + '*diff*';

    return this.http_call({
        method: 'PATCH',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        url: this.url_base + 'case/' + case_id,
        data: diff
    });
};

rest_case_mixin1.post_case =  function (case_doc) {
    if (typeof case_doc === 'undefined') throw this.req_msg + '*case_doc*';

    return this.http_call({
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        url: this.url_base + 'case/',
        data: case_doc
    });
};

