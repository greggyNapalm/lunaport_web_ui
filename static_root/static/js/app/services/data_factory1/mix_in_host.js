/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';


var rest_host_mixin = new REST_resource_mixin(); 
rest_host_mixin.post_host = function (fqdn) {
    /* Create new host entrie.
    */
    if(typeof(fqdn) === 'undefined') {
        throw 'Rrequired parameters missing:*fqdn*';
    }
    var body = {
        'fqdn': fqdn
    };
    return this.http({
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        url: this.url_base + 'host/',
        data: body,
    });
};

rest_host_mixin.get_host_names_butch =  function () {
    return this.http_call({
        method: 'GET',
        url: this.url_base + 'host/?names_butch=true'
    });
};

rest_host_mixin.get_host =  function (fqdn) {
    if (typeof fqdn === 'undefined') throw this.req_msg + '*fqdn*';

    return this.http_call({
        method: 'GET',
        url: this.url_base + 'host/' + fqdn
    });
};

rest_host_mixin.get_many =  function (fillter) {
    var params = {};
    var f_attrs_allowed = [
        'line',
        'dc',
        'is_spec_tank',
        'is_tank',
        'ip_addr'
    ];
    if (fillter) {
        for (var i = 0; i < f_attrs_allowed.length; i++) {
            var attr_name = f_attrs_allowed[i];
            if (_.has(fillter, attr_name)) {
                params[attr_name] = fillter[attr_name];
            }
        }
    }

    return this.http_call({
        method: 'GET',
        url: this.url_base + 'host/' + '?' + jQuery.param(params)
    });
};

