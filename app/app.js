require('./github');

angular.module('vincit', ['ngRoute', 'GitHubVisualization'])
 
.config(function($routeProvider) {
    $routeProvider
        .when('/:userId?', {
            controller: 'ProjectListController as projectList',
            templateUrl: 'partials/list'
        })
});