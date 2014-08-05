/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';

var rest_error_handle_mixin1 = {
    handle_error:function (resp, muted_codes) {
        /* HTTP and network error handler.
        *  muted_codes - array of ints, HTTP response status codes to ignore.
        */
        if (_.contains(muted_codes, resp.status)) {
            return null;
        }

        var alert_msg = {};
        if (resp.status == 401) {
            alert_msg = {
                type: 'danger',
                msg: 'HTTP Error 401 Unauthorized, redirecting to authentication page' 
            };
            this.AlertService.prepForBroadcast(alert_msg);
            setTimeout(function () {
                window.location.replace(ya.redirectToAuth());
            }, 3000);
        } else if (resp.status == 502) {
            alert_msg = {
                type: 'danger',
                msg: 'Looks like backend overloaded or down.'
            };
        } else if (resp.status === 0) {
            alert_msg = {
                type: 'danger',
                msg: 'Service unreachable, network connectivity problem.' 
            };
        } else {
            if (_.has(resp.data, "error_type") && _.has(resp.data, "error_text")) {
                alert_msg = {
                    type: 'warning',
                    msg: resp.data.error_type + ': ' + resp.data.error_text
                };
            } else {
                alert_msg = {
                    type: 'warning',
                    msg: 'Service call failed by unknown reason' 
                };
            }
        }
        this.AlertService.prepForBroadcast(alert_msg);
    },
    handle_missing: function (data, status, headers, config) {
        var _config = config;
        if (_config.retries_num <= 0) {
            console.info('max retries');
            this.handle_error(data, status, headers, _config);
        }
        _config.retries_num--;
        var e = new APIexc({'data': data});
        if (e.missing_issue()){
            console.info('auto create issue:', e.miss_resource);
            this.post_issue(e.miss_resource, true, _config.retries_num)
                .success(function() {
                    return this.http(_config);
                })
                .error(this.handle_missing);
        } else if (e.missing_user()) {
            console.info('auto create user:', e.miss_resource);
            this.post_user(e.miss_resource)
                .success(function() {
                    return this.http(_config);
                })
                .error(this.handle_missing);
        } else if (e.missing_proj()) {
            console.info('auto create proj:', e.miss_resource);
            this.post_proj(e.miss_resource)
                .success(function() {
                    return this.http(_config);
                })
                .error(this.handle_error);
        } else if (e.missing_server()) {
            console.info('auto create server:', e.miss_resource);
            this.post_host(e.miss_resource)
                .success(function() {
                    return this.http(_config);
                })
                .error(this.handle_error);

        } else {
            console.info('Can\'t catch missing resource');
            console.info(_config.retries_num);
            this.handle_error(data, status, headers, config);
        }
    },
};
