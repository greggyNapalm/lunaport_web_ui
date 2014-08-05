/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';

app.factory('RuntimeCache', function($cacheFactory) {
    return $cacheFactory('RuntimeCache', {
        capacity: 3 // optional - turns the cache into LRU cache
    });
});
