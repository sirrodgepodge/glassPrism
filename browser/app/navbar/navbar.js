var globalVar2;

app.directive('navbar', ['$rootScope', '$state', '$timeout', '$http', 'AuthService', 'AUTH_EVENTS', 'Session', function($rootScope, $state, $timeout, $http, AuthService, AUTH_EVENTS, Session) {

    var NavbarCtrl = ['$scope', function($scope) {

        // initializing toggle comments box
        $scope.commentsShowing = false;
        $scope.comments = [];
        //// Auth info gettage
        $scope.user = null;

        // dealing with login transition thing
        $scope.slidin = false;

        var setUser = function() {
            AuthService.getLoggedInUser().then(function(user) {
                if (user) {
                    $scope.user = user;
                } else {
                    $scope.slidin = true;
                }
            });
        };
        setUser();

        var removeUser = function() {
            $scope.user = null;
            $scope.slidin = true;
        };

        $scope.logout = function() {
            AuthService.logout().then(function() {
                $state.go('home');
                $scope.slidin = true;
            });
        };

        // Search handling
        $scope.runSearch = function() {
            $scope.loading = true;
            Session.search = $scope.search;
            $rootScope.$broadcast("searchUpdate");
            $timeout(function() {
                $scope.loading = false;
            }, 300);
        };

        $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
        $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
        $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);

    }];

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'app/navbar/navbar.html',
        link: function(scope) {

            // make navbar collapse when menu item is selected
            var navBarCollapse = $('.navbar-collapse');
            scope.collapseNav = function() {
                navBarCollapse.collapse('hide');
            };
        },
        controller: NavbarCtrl
    };
}]);
