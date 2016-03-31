angular.module('DatalistFilter', [])

.directive('ghvDatalistFilter', function() {
    return {
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@',
            filter: '=',
            filterName: '@',
            options: '='
        },
        templateUrl: 'directives/filters/datalist'
    }
});
