app.service('glassData', function($http, $q) {
    this.currentData = [];

    this.selections = {
        industry: ['Internet'],
        company: [],
        jobTitle: []
    };

    this.update = function(prop, val) {
        var selections = this.selections;
        if(Object.keys(selections).indexOf(prop) === -1) throw new Error('not a property on glassData.selections object');
        else {
            selections[prop] = val;
            //this.retrieveFilteredData(selections);
        }
    };

    this.filterByProp = function(typeProp, data){
                if(typeProp === 'jobTitle'){
                data = data.map(function(obj){
                    var avgDiv = 1,
                        total = obj.salary,
                        ovrRat = obj.overallRating;
                    for(var i = 0; i<data.length; i++){
                        if(obj.jobTitle === data[i].jobTitle){
                            avgDiv = avgDiv+1;
                            total = total + data[i].salary;
                            ovrRat = ovrRat + data[i].overallRating;
                        }
                    }
                    return {
                        jobTitle: obj.jobTitle,
                        salary: Math.floor(total/avgDiv),
                        overallRating: Math.floor((ovrRat/avgDiv)*100)/100
                    };
                });
                data = data.sort(function(a,b){
                        var textA = a.jobTitle.toUpperCase();
                        var textB = b.jobTitle.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
                var jobData = [];
                    for(var i = 0; i < data.length-1; i++){
                        if(data[i].jobTitle !== data[i+1].jobTitle){
                            jobData.push(data[i]);
                        }
                    }
                    jobData = jobData.sort((a,b)=>a.salary-b.salary);
                    data = jobData;
                }
                else if(typeProp === "company"){
                    data = data.sort((a,b) => a.salary - b.salary);
                }
        return data;
    };

    this.filterData = function(prop, str) {
        console.log(prop, str);
        if(prop && str) this.selections[prop] = this.selections[prop].indexOf(str) > -1 ?
            this.selections[prop].filter(val => val !== str) :
            this.selections[prop].concat(str);

        const deferred = $q.defer();

        const startTime = new Date();
        $http.post('/api/glassDoorData', this.selections)
            .then((response) => {
                console.log("this took "+ (((new Date())-startTime)/1000)+" seconds");
                this.currentData = [];
                response.data.forEach((company) =>
                    company.salaries.forEach((job) =>
                        this.currentData.push({
                            industry: company.industry,
                            jobTitle: job.title,
                            salary: job.salary,
                            company: company.name,
                            overallRating: company.overallRating
                        })));
                 deferred.resolve();
            })
            .catch((err) => deferred.reject(err));
        return deferred.promise;
    };

    this.getAllData = () => $http.get('/api/glassDoorData')
        .then((response) => {
            this.currentData = response.data;
        });
});
