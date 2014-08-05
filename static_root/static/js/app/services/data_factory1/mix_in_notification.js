/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';

var rest_notification_mixin = new REST_resource_mixin(); 

rest_notification_mixin.get_notification =  function (case_name, user_login) {
    /* Retrieve notification settings for particular case, user pair. */
    if (typeof case_name === 'undefined') throw this.req_msg + '*case_name*';
    if (typeof user_login === 'undefined') throw this.req_msg + '*user_login*';
    
    return this.http_call({
        method: 'GET',
        url: this.url_base + 'notifications/' + case_name + '/' + user_login
    });
};

rest_notification_mixin.post_notification =  function (case_name, user_login, cfg) {
    /* Create new notification settings entrie for particular case, user pair. */
    if (typeof case_name === 'undefined') throw this.req_msg + '*case_name*';
    if (typeof user_login === 'undefined') throw this.req_msg + '*user_login*';
    if (typeof cfg === 'undefined') throw this.req_msg + '*cfg*';
    
    var body = {
        'case_name': case_name,
        'user_login': user_login,
        'cfg': cfg
    };

    return this.http_call({
        method: 'POST',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        url: this.url_base + 'notifications/',
        data: body 
    });
};

rest_notification_mixin.patch_notification =  function (case_name, user_login, cfg) {
    /* Create new notification settings entrie for particular case, user pair. */
    if (typeof case_name === 'undefined') throw this.req_msg + '*case_name*';
    if (typeof user_login === 'undefined') throw this.req_msg + '*user_login*';
    if (typeof cfg === 'undefined') throw this.req_msg + '*cfg*';
    
    var body = {
        'case_name': case_name,
        'user_login': user_login,
        'cfg': cfg
    };

    return this.http_call({
        method: 'PATCH',
        headers: {'Content-Type': 'application/json; charset=utf-8'},
        url: this.url_base + 'notifications/' + case_name + '/' + user_login,
        data: body 
    });
};
