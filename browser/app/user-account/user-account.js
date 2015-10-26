app.config(['$stateProvider',function($stateProvider) {

    $stateProvider.state('user-account', {
        url: '/user-account',
        templateUrl: 'app/user-account/user-account.html',
        controller: 'UserAccountCtrl'
    });

}]);

app.controller('UserAccountCtrl',['$scope', '$state', '$timeout', 'AuthService', function($scope, $state, $timeout, AuthService) {

    $scope.user = {};
    $scope.error = {};

    AuthService.getLoggedInUser().then(function(user) {
        if (!user) {
            $state.go('home.landing');
        } else {
            $scope.user = user;
            // Add admin route functions if user is an Admin
            if (user.admin) {
                $scope.addAdmin = function() {
                    $scope.error.addAdmin = null;
                    AuthService.adminPriv(user, $scope.newAdminEmail, 'add').then(function(user) {
                        $scope.error.addAdmin = 'User Added as Admin';
                        $timeout(function() {
                            $scope.error.addAdmin = null;
                            $scope.newAdminEmail = '';
                        }, 1000);
                    }).catch(function() {
                        $scope.error.addAdmin = 'User is already Admin';
                    });
                };

                $scope.removeAdmin = function() {
                    $scope.error.removeAdmin = null;
                    AuthService.adminPriv(user, $scope.removeAdminEmail, 'remove').then(function(user) {
                        $scope.error.removeAdmin = 'User Removed from being an Admin';
                        $timeout(function() {
                            $scope.error.removeAdmin = null;
                            $scope.removeAdminEmail = '';
                        }, 1000);
                    }).catch(function() {
                        $scope.error.removeAdmin = 'No user to remove';
                    });
                };

                $scope.deleteUser = function() {
                    $scope.error.deleteUser = null;
                    AuthService.deleteUser($scope.userToDelete).then(function(user) {
                        $scope.error.deleteUser = 'User deleted';
                        $timeout(function() {
                            $scope.error.deleteUser = null;
                            $scope.userToDelete = '';
                        }, 1000);
                    }).catch(function() {
                        $scope.error.deleteUser = 'No user to delete';
                    });
                };
            }
        }
    });
}]);
