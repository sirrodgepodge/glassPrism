app.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'app/home/home.html',
        resolve: {
            resolved: ['AuthService', function(AuthService) {
                return AuthService.getLoggedInUser();
            }]
        },
        controller: 'HomeCtrl'
    });
}]);

app.controller('HomeCtrl', ['$scope', '$http', '$rootScope', '$state', '$stateParams', 'Session', function($scope, $http, $rootScope, $state, $stateParams, Session) {

    if (Session.user) $scope.search = Session.user.search;
    else $scope.search = '';
    
    $rootScope.$on("searchUpdate",function(){
        $scope.appFilter = Session.search;
    });

}]);
