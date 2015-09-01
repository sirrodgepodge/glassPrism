var requestify = require('requestify'),
    cheerio = require('cheerio'),
    mongoose = require('mongoose'),
    startDb = require('./db'),
    Employer = mongoose.model('Employer');

// var queryObj = {
//     "t.p": 42120,
//     "t.k": "gHxlKTuKw6S",
//     userip: "0.0.0.0",
//     useragent: "",
//     format: "json",
//     v: 1,
//     action: "jobs-stats",
//     returnStates: true,
//     //returnCities: true,
//     //returnEmployers: true,
//     //returnJobTitles: true,
//     admLevelRequested: 1,
//     jobType: "fulltime",
//     fromAge: 14,
//     country: "United States",
//     state: "New York",
//     city: "New York, NY"
// };

var query = {
    "t.p": 42120,
    "t.k": "gHxlKTuKw6S",
    userip: "0.0.0.0",
    useragent: "",
    format: "json",
    v: 1,
    action: "employers",
    // country: "United States",
    // state: "New York",
    // city: "New York, NY",
    pn: 1,
    l: "United States",
    //q: "amazon",

    //stores how many pages the query has returned
    totalNumberOfPages: 0,

    //keeps track of how many results have been processed relative all results
    counter: 0,
    resultLength: 0
};


startDb.then(function() {
    return pullCompanyPage(query, function keepGoing() {
        query.pn++;
        if (query.pn <= query.totalNumberOfPages) {
            console.log('Page', query.pn.toString(), 'here we go!!!');
            pullCompanyPage(query, keepGoing);
        } else return console.log('Done at Last :)');
    });
});


function pullCompanyPage(queryObject, nextCompPageCb) {
    requestify.request('http://api.glassdoor.com/api/api.htm', {
            method: 'GET',
            body: {},
            // cookies: {
            //     mySession: 'some cookie value'
            // },
            // auth: {
            //     username: 'foo',
            //     password: 'bar'
            // },
            dataType: 'json',
            params: queryObject
        })
        .then(function(response) {
            if (!response) return nextCompPageCb(false);

            // get employers from response body
            var employers = response.getBody().response.employers;

            // keeps track of how many results have been processed relative all results
            if(!queryObject.totalNumberOfPages) {
                queryObject.totalNumberOfPages = response.getBody().response.totalNumberOfPages;
                console.log(queryObject.totalNumberOfPages.toString(), 'pages total to go through');
            }
            queryObject.counter = 1;
            queryObject.resultLength = employers.length;

            // loop through each employer, add salary data, then store information
            return employers.forEach(function(val, index) {
                var id = val.id;
                var name = val.name.replace(/\s/g, '-');

                // log employer ID and name
                console.log(name, '-', val.industry, '-', val.numberOfRatings);

                // create array to store salaries data
                val.salaries = [];

                return pullSalaryPage(val.salaries, name, id, '', function recurseCallBack(newPage) {
                    // continue until last page then store results in database
                    if (newPage) {
                        // log current page number and name of company for entertainment :)
                        console.log(newPage, '_', name);

                        // continue to next page
                        pullSalaryPage(val.salaries, name, id, newPage, recurseCallBack);
                    } else {
                        console.log(val.name, "done!!!!!");
                        return Employer.create({
                            glassDoorId: id,
                            name: name,
                            website: val.website,
                            industry: val.industry,
                            numberOfRatings: val.numberOfRatings,
                            squareLogo: val.squareLogo,
                            overallRating: val.overallRating,
                            ratingDescription: val.ratingDescription,
                            cultureAndValuesRating: +val.cultureAndValuesRating,
                            seniorLeadershipRating: +val.seniorLeadershipRating,
                            compensationAndBenefitsRating: +val.compensationAndBenefitsRating,
                            careerOpportunitiesRating: +val.careerOpportunitiesRating,
                            workLifeBalanceRating: +val.workLifeBalanceRating,
                            recommendToFriendRating: +val.recommendToFriendRating,
                            ceo: val.ceo,
                            salaries: val.salaries
                        }, function(err, added) {
                            if (err) {
                                if (err.message.indexOf('duplicate key error') > -1) console.log(val.name, "already exists :(");
                                else console.log(err);
                            } else {
                                console.log(val.name, "added!!!!!!!!!!");
                            }
                            queryObject.counter++;
                            return queryObject.counter === queryObject.resultLength ? nextCompPageCb() : console.log((queryObject.resultLength - queryObject.counter).toString(), 'more left');
                        });
                    }
                });
            });
        }).catch(function(err) {
            // log errors
            return console.log(err);
        });
}


function pullSalaryPage(dataArr, name, id, page, nextSalPageCb) {
    requestify.get('http://www.glassdoor.com/Salary/' + name + '-Salaries-E' + id + page + '.htm').then(function(html) {

        //load response into cheerio, i.e. server jQuery
        var $ = cheerio.load(html.getBody());

        //detect if this is the last page, if not store next page string
        lastPage = !!$('.pagingControls ul .current.last').html() ? true : !$('.pagingControls ul .current').html() ? true : false;
        page = lastPage ? null : !page.length ? '_P2' : '_P' + (+page.slice(2) + 1);

        //grab sections containing individual role salary info
        var jobSections = $('.jobTitleCol');

        //initialize variables for use in loop
        var title = '';
        var salary = 0;
        var sampleSize = 0;
        var lowEnd = '';
        var highEnd = '';

        //data handling
        var salaryFactor = 0;
        var selectNonNumeric = /\D+/g;
        var removeHourlyMonthly = /\s-\s(hourly|monthly|contractor|hourly contractor)/ig;
        var findNA = /n\/a/i;

        jobSections.each(function(i, item) {
            // jQuery-ify 'item'
            item = $(item);

            // populate vars with page content
            title = item.find('span.i-occ.strong.noMargVert').html().trim();
            salary = item.find('.meanPay').html().replace(selectNonNumeric, '');
            sampleSize = item.find('.salaryCount').html().replace(selectNonNumeric, '');

            // deal with hourly and monthly pay            
            salaryFactor = title.indexOf('Hourly') >= 0 ? salaryFactor = 2000 : title.indexOf('Monthly') >= 0 ? 12 : 1;

            // store low end and high end of range
            lowEnd = item.find('.rangeValues .alignLt').html().replace(selectNonNumeric, '') *
                salaryFactor * (salaryFactor < 2000 ? 1000 : 1);
            highEnd = item.find('.rangeValues .alignRt').html().replace(selectNonNumeric, '') *
                salaryFactor * (salaryFactor < 2000 ? 1000 : 1);

            // handles if salary is "n/a"
            if (findNA.test(salary)) salary = (lowEnd + highEnd) / 2;
            else salary = salary * salaryFactor;

            // push results to array
            dataArr.push({
                title: title.trim().replace(removeHourlyMonthly, ''),
                salary: salary,
                lowEnd: lowEnd,
                highEnd: highEnd,
                sampleSize: +sampleSize.slice(0, sampleSize.indexOf(' '))
            });
        });
        // trigger callback if provided, feeding in next page number (null if last page)
        return nextSalPageCb ? nextSalPageCb(page) : null;
    });
}