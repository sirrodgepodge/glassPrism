app.filter('capitalize', function() {
    return function(input) {
        return typeof input === 'string' ? input.split(' ').map(function(val) {
            return val.charAt(0).toUpperCase() + val.slice(1);
        }).join(' ') : input;
    };
});
