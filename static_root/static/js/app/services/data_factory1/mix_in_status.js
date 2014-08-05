/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';

var rest_status_mixin = new REST_resource_mixin(); 
rest_status_mixin.get_status =  function () {
    /* Retrieve server side modules and packages versions, uptime and workers state.
    */
    return this.http_call({
        method: 'GET',
        url: this.url_base + 'status/'
    });
};
