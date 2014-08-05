/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, app, ya, helpers */
'use strict';

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/', {redirectTo: '/tests'});
    $routeProvider.when('/notfound', {
        templateUrl: '/static/tmpl/notfound.html',
        controller: 'NotfoundCtrl'
    });
    $routeProvider.when('/settings', {
        templateUrl: '/static/tmpl/settings.html',
        controller: 'SettingsCtrl'
    });
    $routeProvider.when('/version', {
        templateUrl: '/static/tmpl/version.html',
        controller: 'VersionCtrl'
    });
    $routeProvider.when('/luna/:lll_test_id', {
        templateUrl: '/static/tmpl/test/lll.html',
        controller: 'TestlllCtrl'
    });
    $routeProvider.when('/import/:lll_test_id', {
        templateUrl: '/static/tmpl/test/import.html',
        controller: 'TestImportCtrl'
    });
    $routeProvider.when('/tests:quick_nav', {
        templateUrl: '/static/tmpl/test/list.html',
        controller: 'TestListCtrl'
    });
    $routeProvider.when('/tests/:test_id/:ammo_tag', {
        templateUrl: '/static/tmpl/test/detail.html',
        controller: 'TestDetailCtrl'
    });
    $routeProvider.when('/cases', {
        templateUrl: '/static/tmpl/case/list.html',
        controller: 'CaseListCtrl'
    });
    $routeProvider.when('/cases/:case_id/edit', {
        templateUrl: '/static/tmpl/case/edit.html',
        controller: 'CaseDetailEditCtrl'
    });
    $routeProvider.when('/cases/new', {
        templateUrl: '/static/tmpl/case/new.html',
        controller: 'CaseNewCtrl'
    });
    $routeProvider.when('/cases/:case_id', {
        templateUrl: '/static/tmpl/case/detail.html',
        controller: 'CaseDetailCtrl'
    });
    $routeProvider.when('/issues/:issue_name', {
        templateUrl: '/static/tmpl/issue_detail.html',
        controller: 'IssueDetailCtrl'
    });
    $routeProvider.when('/status/', {
        templateUrl: '/static/tmpl/status.html',
        controller: 'StatusCtrl'
    });
    $routeProvider.when('/ammos', {
        templateUrl: '/static/tmpl/ammo/list.html',
        controller: 'AmmoListCtrl'
    });
    $routeProvider.when('/ammo/:ammo_id/:ammo_hash', {
        templateUrl: '/static/tmpl/ammo/detail.html',
        controller: 'AmmoDetailCtrl'
    });
    $routeProvider.otherwise({redirectTo: '/notfound'});
}]);
