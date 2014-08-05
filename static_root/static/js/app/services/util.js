/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, moment, angular, ya, CONST, helpers, app */
'use strict';


app.factory('util', function() {
    /* Routines to help with time conversion.
    */
    return {
        utc_to_tbl: function(iso_utc_time) {
            /* Convert ISO 8601 formated UTC zone stamp to local zone,
            *  pretty print than.
            */
            if(!(Boolean(iso_utc_time))) {
                return '-';
            } else {
                var stmp = moment.utc(iso_utc_time);
                stmp.local();

                if (stmp.format('YYYYMMDD') != moment().format('YYYYMMDD')) {
                    var short_format = 'D MMM.';
                } else {
                    var short_format = 'HH:mm';
                }
                return {
                    'short': stmp.format(short_format),
                    'local': stmp,
                    'long': stmp.format('YYYY/MM/DD HH:mm:ss') + ' (' + stmp.fromNow() + ')'
                };
            }
        },
        duration_hum: function(utc_stamp0, utc_stamp1) {
            /* Calc time delta between two ISO 8601 formated UTC zone stamps.
            */
            if (!(_.every([utc_stamp0, utc_stamp1], _.identity))) {
                return null;
            }
            var diff = moment.utc(utc_stamp1).diff(moment.utc(utc_stamp0));
            var duration = moment.duration(diff);
            return  moment.utc(diff).format('HH\\h:mm\\m:ss\\s') + ' (' + duration.humanize() + ')';
        },
        issue_lnk: function(tracker_name, issue_name) {
            /* Compose issue externak lnk. */
            if (tracker_name == 'jira') {
                return CONST.get('LINKS')[tracker_name + '_base'] + 'browse/' + issue_name;
            } else if (tracker_name == 'startrack') {
                return CONST.get('LINKS')[tracker_name + '_base'] + issue_name;
            } else {
                return null;
            }
        },
        art_public_lnk: function(tank_api_lnk) {
            var lnk_spltd = tank_api_lnk.split('/');
            var tank_name = lnk_spltd[2].split('.')[0];
            var tank_test_id = lnk_spltd[6];
            var art_file_name = lnk_spltd[8];

            return [
                    CONST.get('LINKS').load_test_arts_proxy,
                    tank_name,
                    tank_test_id,
                    art_file_name
                ].join('/');
        },
        badge_snippet: function(api_hostname, case_id) {
            var png_lnk = [
                'http://' + api_hostname,
                CONST.get('API_URL').LUNAPORT + 'case/' + case_id,
                '/badge/img.png'
            ].join(''); 
            var png_marked_lnk = [
                'http://',
                api_hostname,
                CONST.get('API_URL').LUNAPORT + 'case/' + case_id,
                '/badge-marked/img.png'
            ].join(''); 
            var start_root_lnk = [
                'http://',
                api_hostname,
                CONST.get('API_URL').LUNAPORT + 'case/' + case_id,
                '/oneshot'
            ].join(''); 
            var case_ui_lnk = 'http://' + api_hostname + '/cases/' + case_id;

            var rv = {
                'wiki': {},
                'jira': {},
                'markdown': {},
                'rst': {},
                'html': {},
            };
            rv.wiki.case_page = '((' + case_ui_lnk + ' ' + png_lnk + '))';
            rv.wiki.launch = '((' + start_root_lnk + ' ' + png_marked_lnk + '))';

            rv.markdown.case_page = '[![Case status](' + png_lnk + ')](' + case_ui_lnk + ')';
            rv.markdown.launch = '[![Start root test](' + png_marked_lnk + ')](' + start_root_lnk + ')';

            rv.rst.case_page = '.. image:: ' + png_lnk + '\n    :target: ' + case_ui_lnk;
            rv.rst.launch = '.. image:: ' + png_marked_lnk + '\n    :target: ' + start_root_lnk;

            rv.html.case_page = '<a href="' + case_ui_lnk + '"><img src="' + png_lnk + '"></a>';
            rv.html.launch = '<a href="' + start_root_lnk + '"><img src="' + png_marked_lnk + '"></a>';

            return rv;
        }
    };
});
