app.service('AuthService', function($http, Session, $rootScope, AUTH_EVENTS, $q) {

    function onSuccessfulAuth(response) {
        var data = response.data;
        data.user.admin = data.admin;
        Session.create(data.id, data.user);
        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        return data.user;
    }

    // Uses the session factory to see if an
    // authenticated user is currently registered.
    this.isAuthenticated = function() {
        return !!Session.user;
    };

    this.getLoggedInUser = function(fromServer) {

        // If an authenticated session exists, we
        // return the user attached to that session
        // with a promise. This ensures that we can
        // always interface with this method asynchronously.

        // Optionally, if true is given as the fromServer parameter,
        // then this cached value will not be used.
        if (this.isAuthenticated() && fromServer !== true) {
            return $q.when(Session.user);
        }

        // Make request GET /session.
        // If it returns a user, call onSuccessfulAuth with the response.
        // If it returns a 401 response, we catch it and instead resolve to null.
        return $http.get('/session').then(onSuccessfulAuth).catch(function() {
            return null;
        });
    };

    this.logout = function() {
        return $http.get('/logout').then(function() {
            Session.destroy();
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        });
    };

    // adds or removes admin privileges from another user
    this.adminPriv = function(user, newAdminEmail, addOrDelete) {
        return $http.post('/api/admins/' + user._id, {email: newAdminEmail, addOrDelete: addOrDelete});
    };

    // deletes another user, requires admin privileges
    this.deleteUser = function(deleteUserEmail) {
        return $http.post('/api/admins/deleteuser', {email: deleteUserEmail});
    };

});
