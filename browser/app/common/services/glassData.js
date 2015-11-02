var globalcheck;

app.service('glassData', function($http) {

    var self = this;
    globalcheck = self;

    this.selections = {
        industry: null,
        company: null,
        jobTitle: null
    };

    this.update = function(prop, val) {
        var selections = this.selections;
        if(Object.keys(selections).indexOf(prop) === -1) throw new Error('not a property on glassData.selections object');
        else {
            selections[prop] = val;
            console.log(selections);
            //this.retrieveFilteredData(selections);
        }
    };

    this.retrieveFilteredData = function(obj) {
        return $http.post('/api/glassDoorData', obj)
        .then(function(data){
            return Promise.resolve(data);
        })
        .catch(function(err){
            console.log(err);
        });
    };
});
