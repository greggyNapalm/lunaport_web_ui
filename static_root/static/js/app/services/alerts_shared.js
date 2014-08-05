/* JSHint strict mode tweak */
/*jshint globalstrict: true*/
/*global console:false */
/*global $:false */
/*global angular:false */
/*global dash:false */
/*global ya:false */
'use strict';

app.factory('AlertService', function($rootScope) {
    /* Service for data exchange between test resource related controllers.
    */

    var AlertService = {};
    
    AlertService.message = '';
    
    AlertService.prepForBroadcast = function(msg) {
      this.message = msg;
      this.broadcastItem();
    };
    
    AlertService.broadcastItem = function() {
      $rootScope.$broadcast('handleBroadcast');
    };
    
    return AlertService;
});
