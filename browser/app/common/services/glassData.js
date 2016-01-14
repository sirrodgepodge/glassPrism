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

    this.filterByProp = function(typeProp,data){
                if(typeProp === 'jobTitle'){
                data = data.map(function(obj){
                    var avgDiv = 1
                    var total =  obj.salary;
                    var ovrRat = obj.overallRating;
                    for(var i = 0; i<data.length; i++){
                        if(obj.jobTitle === data[i].jobTitle){
                            avgDiv = avgDiv+1;
                            total = total + data[i].salary;
                            ovrRat =  ovrRat + data[i].overallRating;
                        }
                    }
                    return {
                        jobTitle: obj.jobTitle,
                        salary: Math.floor(total/avgDiv),
                        overallRating: Math.floor((ovrRat/avgDiv)*100)/100
                    }
                })
                data = data.sort(function(a,b){
                        var textA = a.jobTitle.toUpperCase();
                        var textB = b.jobTitle.toUpperCase();
                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                })
                var jobData = [];
                    for(var i = 0; i < data.length-1; i++){
                        if(data[i].jobTitle !== data[i+1].jobTitle){
                            jobData.push(data[i])
                        }
                    }
                jobData = jobData.sort((a,b)=>a.salary-b.salary)
                data = jobData
                }
                else if(typeProp === "company"){
                data = data.sort(function(a,b){return a.salary - b.salary})
                }
        return data
    }

    this.filterData = function(prop, str) {
        console.log(prop, str)

        if(this.selections[prop].indexOf(str) > -1) this.selections[prop].filter(val => val !== str);
        else this.selections[prop].push(str);

        return $http.post('/api/glassDoorData', this.selections)
        .then((data) => {
                this.currentData = data.data.map(function(obj){
                        for(var i = 0; i< obj.salaries.length; i++){
                            return {
                                industry: obj.industry,
                                jobTitle: obj.salaries[i].title,
                                salary: obj.salaries[i].salary,
                                company: obj.name,
                                overallRating: obj.overallRating

                            }
                        }
                })
                var sendData = this.currentData;
                // console.log(sendData)
            return sendData
        })
        // .catch((err) =>{
        //     console.log(err);
        //     return Promise.reject(err);
        // });
    };

    this.getAllData =  function(){
        return $http.get('/api/glassDoorData')
            .then(function(data){ 
                this.currentData =  data.data})
    }
});
