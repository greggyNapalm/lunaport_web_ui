/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc, REST_resource_mixin */
'use strict';

var rest_hook_mixin = new REST_resource_mixin(); 
rest_hook_mixin.get_hooks =  function () {
    var url = this.url_base + 'hooks/';
    return this.http_call({
        method: 'GET',
        url: url
    });
};

rest_hook_mixin.get_hook_registrations =  function (case_id) {
    if (typeof case_id === 'undefined') throw this.req_msg + '*case_id*';
    var url = this.url_base + 'hooks/registration/?case_id=' + case_id;
    return this.http_call({
        method: 'GET',
        url: url
    });
};

rest_hook_mixin.patch_hook_registration =  function (h_rg_id, diff) {
    if (typeof h_rg_id === 'undefined') throw this.req_msg + '*hook registration id*';
    if (typeof diff === 'undefined') throw this.req_msg + '*diff*';

    return this.http_call({
        method: 'PATCH',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        url: this.url_base + 'hooks/registration/' + h_rg_id,
        data: diff
    });
};

rest_hook_mixin.post_hook_registration =  function (case_id, hook_id, doc) {
    if (typeof case_id === 'undefined') throw this.req_msg + '*case_id*';
    if (typeof hook_id === 'undefined') throw this.req_msg + '*hook_id*';

    doc.case_id = case_id;
    doc.hook_id = hook_id;
    doc.descr = 'Created in UI';

    return this.http_call({
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        url: this.url_base + 'hooks/registration/',
        data: doc
    });
};

rest_hook_mixin.delete_hook_registration =  function (h_rg_id) {
    if (typeof h_rg_id === 'undefined') throw this.req_msg + '*hook registration id*';

    return this.http_call({
        method: 'DELETE',
        url: this.url_base + 'hooks/registration/' + h_rg_id,
    });
};


