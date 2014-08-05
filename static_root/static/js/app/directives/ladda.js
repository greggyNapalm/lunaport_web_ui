/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers, app */
'use strict';

app.directive('uiLadda', [function () {
    return {
        link: function postLink(scope, element, attrs) {
            var ladda = Ladda.create(element[0]);
            scope.$watch(attrs.uiLadda, function(newVal, oldVal){
                if (angular.isNumber(oldVal)) {
                    if (angular.isNumber(newVal)) {
                        ladda.setProgress(newVal);
                    } else {
                        newVal && ladda.setProgress(0) || ladda.stop();
                    }
                } else {
                    newVal && ladda.start() || ladda.stop();
                }
            });
        }
    };
}]);
