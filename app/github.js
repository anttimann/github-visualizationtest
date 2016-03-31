require('./filters/datalist');
require('./displays/datatable');

var _ = require('lodash');

angular.module('GitHubVisualization', ['ngResource', 'DatalistFilter', 'Datatable'])
    
.factory('GithubUserRepos', function($resource) {
    return $resource('/github/:userId');
})

.controller('ProjectListController', function($routeParams, GithubUserRepos) {
    var ctrl = this;

    ctrl.filter = {
    };

    ctrl.githubUser = '';
    ctrl.users = [];
    ctrl.commiters = [];
    
    ctrl.getGitHubData = getGitHubData;

    if ($routeParams.userId) {
        ctrl.githubUser = $routeParams.userId;
        ctrl.getGitHubData($routeParams.userId);
    }

    function getGitHubData(userId) {
        ctrl.filter = {
        };
        ctrl.users = [];
        ctrl.commiters = [];
        ctrl.titles = [
            {
                id: 'name',
                title: 'Name'
            }, {
                id: 'repository',
                title: 'Repository'
            }, {
                id: 'commits',
                title: 'Commits'
            }
        ];

        GithubUserRepos.get({userId: userId}, function (values) {
            delete values.$promise;
            delete values.$resolved;

            ctrl.users = _(values)
                .keys()
                .sort().value();

            ctrl.commiters = _(values)
                .values()
                .flatten().value();

            ctrl.repositories = _(ctrl.commiters)
                .map('repository')
                .uniq()
                .sort().value();
        });
    }
});
