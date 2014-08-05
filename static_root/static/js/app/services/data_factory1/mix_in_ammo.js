/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';

var rest_ammo_mixin1 = new REST_resource_mixin(); 

rest_ammo_mixin1.get_ammos =  function (url, per_page, fillter) {
    url = url || this.url_base + 'ammo/';
    var params = {}; 

    if(!(_.isUndefined(per_page))) {
        params.per_page = per_page;
    }

    if (fillter) {
        if (_.has(fillter, 'case')) {
            params['case'] = fillter['case'];
        }
    }

    var cur_url = null;
    if (!(_.isEmpty(params))) {
        cur_url = url + '?' + jQuery.param(params)
    } else {
        cur_url = url
    }

    return this.http_call({
        method: 'GET',
        url: cur_url
    });
};

rest_ammo_mixin1.get_ammo =  function (ammo_id) {
    if (typeof ammo_id === 'undefined') throw this.req_msg + '*ammo_id*';

    return this.http_call({
        method: 'GET',
        url: this.url_base + 'ammo/' + ammo_id
    });
};

rest_ammo_mixin1.get_ammo_by_hash =  function (ammo_hash) {
    if (typeof ammo_hash === 'undefined') throw this.req_msg + '*ammo_hash*';

    return this.http_call({
        method: 'GET',
        url: this.url_base + 'ammo/?hash=' + ammo_hash
    });
};

rest_ammo_mixin1.patch_ammo =  function (ammo_id, diff) {
    if (typeof ammo_id === 'undefined') throw this.req_msg + '*ammo_id*';
    if (typeof diff === 'undefined') throw this.req_msg + '*diff*';

    return this.http_call({
        method: 'PATCH',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        url: this.url_base + 'ammo/' + ammo_id,
        data: diff
    });
};

rest_ammo_mixin1.post_ammo =  function (ammo_doc) {
    if (typeof ammo_doc === 'undefined') throw this.req_msg + '*ammo_doc*';

    return this.http_call({
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        url: this.url_base + 'ammo/',
        data: ammo_doc
    });
};
