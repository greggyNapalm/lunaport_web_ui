/* JSHint strict mode tweak */
/*jshint globalstrict: true, browser: true, devel:true */
/*global $, _, angular, ya, app, APIexc */
'use strict';

var parseQuery = function(query, sep, eq) {
    /* got from @miripiruni.
     * Парсит строку вида "param1=value1&param2=value2&param2&param3=value3"
     * и возвращает объект:
     * {
     *     param1: value1,
     *     parma2: [value2, ''],
     *     param3: value3
     * }
     * Аналог http://nodejs.org/api/querystring.html#querystring_querystring_parse_str_sep_eq
     * @param {String} query
     * @param {String} [sep='&']
     * @param {String} [eq='=']
     * @return {Object}
    */
       var params = {},
           queryParams,
           tmp, value, key;

       query || (query = document.location.search.substring(1));

       if ( ! query) {
           return params;
       }

       sep || (sep = '&');
       eq || (eq = '=');

       queryParams = query.split(sep);

       for (var i = 0, size = queryParams.length; i < size; ++i) {
           tmp = queryParams[i].split(eq);
           value = tmp[1] !== undefined ? decodeURIComponent(tmp[1]) : '';
           key = decodeURIComponent(tmp[0]);

           if (params.hasOwnProperty(key)) {
               if ( ! Array.isArray(params[key])) {
                   params[key] = [ params[key], value ];
               } else {
                   params[key].push(value);
               }
           } else {
               params[key] = value;
           }
       }

       return params;
};

var rest_test_mixin1 = new REST_resource_mixin(); 
rest_test_mixin1.get_tests =  function (url, per_page, fillter) {
    /* Retrieve test entries from REST API, infinit data pagination aka
    *  GitHUb api.
    */
    url = url || this.url_base + 'tests/';
    var url_spltd = url.split('?')
    if (url_spltd.length == 1) {
        var params = {};
    } else {
        var params = parseQuery(url_spltd[1], '&', '=');
    }

    if (per_page) {
        params.per_page = per_page;
    }
    if (fillter) {
        if (_.has(fillter, 'case')) {
            params['case'] = fillter['case'];
        }
        if (_.has(fillter, 'issue')) {
            params['issue'] = fillter['issue'];
        }
        if (_.has(fillter, 'ammo')) {
            params['ammo'] = fillter['ammo'];
        }
    }

    return this.http_call({
        method: 'GET',
        url: url_spltd[0] + '?' + jQuery.param(params) 
    });
};

rest_test_mixin1.get_test =  function (test_id) {
    /* Fetch single test resource by uniq id.
    */
    if (typeof test_id === 'undefined') throw this.req_msg + '*test_id*';
    return this.http_call({
        method: 'GET',
        url: this.url_base + 'tests/' + test_id
    });
};

rest_test_mixin1.post_force = function (load_cfg_str) {
    /* Launch new load test via Tank API and 
    *  create appropriate entrie in Lunaport domain.
    */
    if (typeof load_cfg_str === 'undefined') throw this.req_msg + '*load_cfg_str*';

    return this.http_call({
        method: 'POST',
        url: this.url_base + 'tests/?force=true',
        data: load_cfg_str,
        //transformRequest: this.form_data_obj,
        //headers: {
        //    'Content-Type': 'multipart/form-data'
        //},
    });
};

rest_test_mixin1.get_test_stat =  function (test_id, ammo_tag) {
    /* Fetch single test statistic resource by uniq id.
    */
    if (typeof test_id === 'undefined') throw this.req_msg + '*test_id*';
    if (typeof ammo_tag === 'undefined') throw this.req_msg + '*ammo_tag*';

    return this.http_call({
        method: 'GET',
        url: this.url_base + 'tests/' + test_id + '/stat/' + ammo_tag 
    });
};

rest_test_mixin1.get_test_ammo_tags =  function (test_id) {
    /* Fetch single test ammo_tags.
    */
    if (typeof test_id === 'undefined') throw this.req_msg + '*test_id*';

    return this.http_call({
        method: 'GET',
        url: this.url_base + 'tests/' + test_id + '/stat' 
    });
};

rest_test_mixin1.get_test_arts =  function (test_id) {
    /* Fetch single test artifacts list.
    */
    if (typeof test_id === 'undefined') throw this.req_msg + '*test_id*';

    return this.http_call({
        method: 'GET',
        url: this.url_base + 'tests/' + test_id + '/arts' 
    });
};
