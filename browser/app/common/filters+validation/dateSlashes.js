app.filter('dateSlashes', function() {
    return function(input) {
        var tempDate = new Date(input);
        return '' + (tempDate.getMonth()+1) + '/' + tempDate.getDate() + '/' + tempDate.getFullYear().toString().slice(2);
    };
});
