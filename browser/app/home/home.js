app.config(['$stateProvider', function($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'app/home/home.html',
        // resolve: {
        //     resolved: ['AuthService', function(AuthService) {
        //         return AuthService.getLoggedInUser();
        //     }]
        // },
        controller: 'HomeCtrl'
    });
}]);

app.controller('HomeCtrl', ['$scope', '$http', '$rootScope', '$state', '$stateParams', 'Session', 'glassData', function($scope, $http, $rootScope, $state, $stateParams, Session, glassData) {

    // if (Session.user) $scope.search = Session.user.search;
    // else $scope.search = '';
    //
    // $rootScope.$on("searchUpdate",function(){
    //     $scope.appFilter = Session.search;
    // });

    $rootScope.directiveCheck = '';
    $scope.currentData = [];

    // can be called without values for default state
    $scope.filterLines = function(prop, val) {
        glassData.filterData(prop, val).then(() =>
            $scope.currentData = glassData.currentData)
        .catch((err) => console.log('err', err));
    };

    // initializing
    $scope.filterLines();
}]);
