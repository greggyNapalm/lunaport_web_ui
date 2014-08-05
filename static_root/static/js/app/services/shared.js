/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';

app.factory('shared', function() {
    /* Service for data exchange between controllers.
    */
    var state = {};
    return {
        set: function(attr_name, attr_value) {
            state[attr_name] = attr_value;
        },
        get: function(attr_name) {
            return state[attr_name];
        }
    }
});
