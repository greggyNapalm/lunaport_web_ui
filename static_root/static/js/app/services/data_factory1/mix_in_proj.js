/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';

var rest_proj_mixin = {
    post_proj: function (proj_name) {
        /* Create new user entrie.
        */
        if(typeof(proj_name) === 'undefined') {
            throw 'Rrequired parameters missing:*proj_name*';
        }
        var body = {
            'name': proj_name
        };
        return this.http({
            method: 'POST',
            headers: {'Content-Type': 'application/json; charset=utf-8'},
            url: this.url_base + 'proj/',
            data: body,
        });
    }
};
