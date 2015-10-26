app.directive('comments', ['Session', function(Session) {

    var CommentsCtrl = ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
        $scope.comments = [];
        $scope.newComment = {};

        $http.get('/api/comment').then(function(res) {
            $scope.comments = res.data;
        });

        $scope.addComment = function(text) {
            $scope.newComment.text = '';
            $http.post('/api/comment', {
                text: text
            }).then(function(res) {
                $scope.comments.push(res.data);
            }).catch(function(err) {
                console.log(err);
            });
        };
    }];

    return {
        restrict: 'E',
        templateUrl: 'app/comments/comments.html',
        controller: CommentsCtrl
    };
}]);
