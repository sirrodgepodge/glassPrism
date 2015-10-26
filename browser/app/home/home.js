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

    if (Session.user) $scope.apps = Session.user.apps;
    else $scope.apps = [];
    $rootScope.$on("searchUpdate",function(){
        $scope.appFilter = Session.search.name;
        console.log(Session.search);
    });

    console.log(Session.search);

    console.log($scope.apps);

    ////send data to server for zipping
    $scope.zipServer = function(pathZippin) {

        pathZippin.appName = $scope.appName;
        pathZippin.htmlStr = pathZippin.html ? pathZippin.html : '';
        pathZippin.cssArr = pathZippin.css ? pathZippin.css.split(',') : [];
        pathZippin.imagesArr = pathZippin.images ? pathZippin.images.split(',') : [];

        return $http.post('/storeit', pathZippin).then(function(res) {
            $scope.apps.push(res.data);
            Session.user.apps.push(res.data);
        });
    };

    //////////////////////not used now

    $scope.photoThumbnail = "http://www.corporatetraveller.ca/assets/images/profile-placeholder.gif";
    $scope.thumbnailHeight = 100;
    $scope.thumbnailWidth = 100;

    $scope.zipClient = function(uploadZippin) {

        uploadZippin.cssArr = uploadZippin.css ? uploadZippin.css.split(',') : [];
        uploadZippin.imagesArr = uploadZippin.images ? uploadZippin.images.split(',') : [];

        console.log(uploadZippin);

        return $http.post('/storeit', uploadZippin).then(function(res) {
            console.log(res);
        });
    };

    var reader = new FileReader();

    reader.onloadend = function(e) {
        console.log(e);
        $scope.$apply(function() {
            $scope.photoThumbnail = e.target.result;
        });
    };

    $scope.readFile = function(input) {
        console.log(input.files[0]);
        console.log("in show photo");
        if (input.files && input.files[0]) {
            if (input.files[0].type.indexOf('image') !== -1) {
                reader.readAsDataURL(input.files[0]);
            } else if (input.files[0].type.indexOf('text') !== -1) {
                reader.readAsText(input.files[0]);
            } else {
                console.log('Not a File you want to upload');
            }
        }
    };
}]);
