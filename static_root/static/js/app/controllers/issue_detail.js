/* JSHint strict mode tweak */
/*jshint globalstrict: true, devel: true, browser: true */
/*global $, _, amplify, angular, ya, helpers, app */
'use strict';

app.controller('IssueDetailCtrl', function IssueDetailCtrl(
    $scope, $routeParams, $location,
    ngTableParams, toaster,
    util, data_factory1) {

    var issue_name = $routeParams.issue_name;
    $scope.issue = null;

    var adapt_isucase = function(issue) {
        issue.reporter_avatar_url = ya.getAvatarLink(issue.reporter);
        issue.assignee_avatar_url = ya.getAvatarLink(issue.assignee);
        issue.tracker_url = util.issue_lnk(issue.provider, issue.name);
        return issue;
    };
    data_factory1.get_issue(issue_name)
        .then(function(resp) {
            $scope.issue = adapt_isucase(resp.data);
            $scope.test_lst_fillter = {
                'issue': $scope.issue.name
            };
        }, function(resp) {data_factory1.handle_error(resp);});
});
