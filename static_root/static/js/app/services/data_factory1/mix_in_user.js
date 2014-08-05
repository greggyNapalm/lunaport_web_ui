/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';


var rest_user_mixin = new REST_resource_mixin(); 
rest_user_mixin.get_user_ident =  function () {
    return this.http_call({
        method: 'GET',
        url: this.url_base + 'userident'
    });
};
