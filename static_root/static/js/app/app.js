/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers */
'use strict';

var app = angular.module('Lunaport', [
    'ui.bootstrap',
    'ngTable',
    'toaster',
    'mousetrap',
    'ui.ace',
    'truncate',
    'ui.scrollfix',
    'ngScrollTo',
    'hljs',
    'btford.markdown',
    'angularFileUpload',
    'monospaced.elastic',
    'xeditable'
]);
app.run(function(editableOptions) {
  editableOptions.theme = 'bs3';
});
