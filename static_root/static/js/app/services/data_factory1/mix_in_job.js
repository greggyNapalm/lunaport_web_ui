/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';

var rest_job_mixin1 = new REST_resource_mixin(); 
rest_job_mixin1.create_job =  function (name, args, kwargs) {
    /* Create new async job resource. */
    if (typeof name === 'undefined') throw this.req_msg + '*name*';
    if (typeof args === 'undefined') throw this.req_msg + '*args*';
    if (typeof kwargs === 'undefined') throw this.req_msg + '*kwargs*';

    var body = {
        'name': name,
        'args': args,
        'kwargs': kwargs
    };
    return this.http_call({
        method: 'POST',
        url: this.url_base + 'job/',
        data: body,
    });
};
