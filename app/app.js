var _ = require('lodash');

angular.module('vincit', ['ngRoute', 'ngResource'])
 
.config(function($routeProvider) {
    $routeProvider
        .when('/:userId?', {
            controller: 'ProjectListController as projectList',
            templateUrl: 'partials/list'
        })
})

.factory('GithubUserRepos', function($resource) {
    return $resource('/github/:userId');
})    

.controller('ProjectListController', function($routeParams, GithubUserRepos) { 
    var ctrl = this;

    ctrl.sort = {
        type: 'commits',
        reverse: true
    };

    ctrl.filter = {
    };

    ctrl.githubUser = '';
    ctrl.users = [];
    ctrl.commiters = [];

    var unfilteredCommiters = [];
    ctrl.getGithubData = getGithubData;

    if ($routeParams.userId) {
        ctrl.githubUser = $routeParams.userId;
        ctrl.getGithubData($routeParams.userId);
    }
    
    function getGithubData(userId) {
        ctrl.filter = {
        };
        ctrl.users = [];
        ctrl.commiters = [];
        
        GithubUserRepos.get({userId: userId}, function (values) {
            delete values.$promise;
            delete values.$resolved;

            ctrl.users = _(values)
                .keys()
                .sort().value();

            unfilteredCommiters = ctrl.commiters = _(values)
                .values()
                .flatten().value();

            ctrl.repositories = _(ctrl.commiters)
                .map('repository')
                .uniq()
                .sort().value();
        });
    };
});
