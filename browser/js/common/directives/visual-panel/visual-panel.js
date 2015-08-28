app.directive('visualPanel', function (RandomGreetings) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/visual-panel/visual-panel.html',
        link: function (scope) {
            scope.greeting = RandomGreetings.getRandomGreeting();
        }
    };

});