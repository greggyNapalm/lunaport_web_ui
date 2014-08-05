/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';

//var rest_token_mixin = {
//    post_token: function (token_descr) {
//        /* Create new auth token entrie.
//        */
//        if(typeof(token_descr) === 'undefined') {
//            throw 'Rrequired parameters missing:*token_descr*';
//        }
//        var body = {
//            'descr': token_descr
//        };
//        return this.http({
//            method: 'POST',
//            headers: {'Content-Type': 'application/json; charset=utf-8'},
//            url: this.url_base + 'token/',
//            data: body,
//        });
//    }
//};
var rest_token_mixin = new REST_resource_mixin(); 
rest_token_mixin.post_token =  function(token_descr) {
    if(typeof(token_descr) === 'undefined') {
        throw 'Rrequired parameters missing:*token_descr*';
    }
    var body = {
        'descr': token_descr
    };
    return this.http_call({
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        url: this.url_base + 'token/',
        data: body,
    });
};

rest_token_mixin.get_tokens =  function() {
    return this.http_call({
        method: 'GET',
        url: this.url_base + 'token/',
    });
};

rest_token_mixin.delete_token =  function(token_id) {
    if(typeof(token_id) === 'undefined') {
        throw 'Rrequired parameters missing:*token_id*';
    }
    return this.http_call({
        method: 'DELETE',
        url: this.url_base + 'token/' + token_id,
    });
};


