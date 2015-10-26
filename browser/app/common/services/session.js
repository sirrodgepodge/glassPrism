var globalVar;

app.service('Session', function($rootScope, $interval, AUTH_EVENTS) {

    var self = this;

    $rootScope.$on(AUTH_EVENTS.notAuthenticated, function() {
        self.destroy();
    });

    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
        self.destroy();
    });

    $rootScope.$on(AUTH_EVENTS.sessionTimeout, function() {
        self.destroy();
    });

    this.id = null;
    this.user = null;

    this.create = function(sessionId, user) {
        this.id = sessionId;
        this.user = user;
        console.log(this.user);
    };

    this.destroy = function() {
        this.id = null;
        this.user = null;
    };
});
