app.directive('mapPanel', function (RandomGreetings) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/map-panel/map-panel.html',
        link: function (scope) {
            scope.greeting = RandomGreetings.getRandomGreeting();
        }
    };

});