app.service('glassData', function($http) {
    this.currentData = [];

    this.selections = {
        industry: [],
        company: [],
        jobTitle: []
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

    this.filterData = function(prop, str) {
        console.log(prop, str)

        if(this.selections[prop].indexOf(str) > -1) this.selections[prop].filter(val => val !== str);
        else this.selections[prop].push(str);

        return $http.post('/api/glassDoorData', this.selections)
        .then((data) => {
            console.log(data.data)
            this.currentData = data.data;
        })
        // .catch((err) =>{
        //     console.log(err);
        //     return Promise.reject(err);
        // });
    };

    this.getAllData =  function(){
        return $http.get('/api/glassDoorData')
            .then(function(data){ 
                console.log(data.data)
                this.currentData =  data.data})
    }
});
