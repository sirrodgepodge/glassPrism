var requestify = require('requestify'),
    chalk = require('chalk'),
    cheerio = require('cheerio'),
    mongoose = require('mongoose'),
    startDb = require('../server/db'),
    Company = mongoose.model('Company');

////For job search
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


// create query object to be passed to api
var query = {
    "t.p": 42564,
    "t.k": "hGbrCTwlKrc",
    userip: "0.0.0.0",
    useragent: "",
    format: "json",
    v: 1,
    action: "employers",
    pn: 500,
    l: "United States",
    //q: "macy's",

    //stores how many pages the query has returned
    totalNumberOfPages: 0,

    //keeps track of how many results have been processed relative all results
    counter: 0,
    resultLength: 0
};


// declare regular expressions
var selectNonNumeric = /\D+/g;
var removeHourlyMonthly = /\s-\s(hourly|monthly|contractor|hourly contractor)/ig;
var findNA = /n\/a/ig;
var dashifyUrl = /['-,\s\.]+/g;
var findAmpersand = /&/g;


// trigger after db connection
startDb.then(function() {
    return pullCompanyPage(query, function keepGoing() {
        query.pn++;
        if (query.pn <= query.totalNumberOfPages) {
            console.log('Page', query.pn.toString(), 'here we go!!!');
            pullCompanyPage(query, keepGoing);
        } else {
            console.log('\nDone at Last :)\n');
            process.kill(1);
        }
    });
})
.catch(function(err){
  console.error(chalk.red(err.stack));
  process.kill(1);
});


// pull one api page
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
            if (!queryObject.totalNumberOfPages) {
                queryObject.totalNumberOfPages = response.getBody().response.totalNumberOfPages;
                console.log('\n' + queryObject.totalNumberOfPages, 'pages total to go through \n');
            }
            queryObject.counter = 1;
            queryObject.resultLength = employers.length;
            console.log(queryObject.resultLength.toString(), 'employers on this page \n');

            // loop through each employer, add salary data, then store information
            return employers.forEach(function(val, index) {
                var id = val.id;
                var name = val.name.replace(dashifyUrl, '-').replace(findAmpersand, 'and');

                // log employer ID and name
                console.log(name, '-', val.industry, '-', val.numberOfRatings);
                if (index + 1 === employers.length) console.log('');
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
                        console.log('\n' + val.name, "done!!!!!");
                        return Company.create({
                            glassDoorId: id,
                            company: val.name,
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
                            pctRecommendToFriend: +val.recommendToFriendRating,
                            ceoPctApprove: val.ceo.pctApprove/100,
                            ceoPctDisapprove: val.ceo.pctDisapprove/100,
                            ceoNumberOfRatings: val.ceo.numberOfRatings,
                            ceoTitle: val.ceo.title,
                            ceoName: val.ceo.name,
                            salaries: val.salaries
                        }, function(err, added) {
                            if (err) {
                                if (err.message.indexOf('duplicate key error') > -1) console.log('\n' + val.name, "already exists :(");
                                else console.log(err);
                            } else {
                                console.log('\n' + val.name, "added!!!!!!!!!!");
                            }
                            queryObject.counter++;
                            return queryObject.counter >= queryObject.resultLength ?
                                nextCompPageCb() :
                                console.log('\n' + (queryObject.resultLength - queryObject.counter), 'more left \n');
                        });
                    }
                });
            });
        }).catch(function(err) {
            // log errors
            return console.log(err);
        });
}


// pull data from a salary page
function pullSalaryPage(dataArr, name, id, page, nextSalPageCb) {
    requestify.get('http://www.glassdoor.com/Salary/' + name + '-Salaries-E' + id + page + '.htm').then(function(html) {

        //load response into cheerio, i.e. server jQuery
        var $ = cheerio.load(html.getBody());

        //detect if this is the last page, if not store next page string
        var lastPage = !!$('.pagingControls ul .current.last').html() ? true : !$('.pagingControls ul .current').html() ? true : false;
        page = lastPage ? null : !page.length ? '_P2' : '_P' + (+page.slice(2) + 1);

        //grab sections containing individual role salary info
        var jobSections = $('.jobTitleCol');

        //initialize variables for use in loop
        var jobTitle = '';
        var salary = 0;
        var sampleSize = 0;
        var lowEnd = '';
        var highEnd = '';

        //data handling
        var salaryFactor = 0;

        jobSections.each(function(i, item) {
            // jQuery-ify 'item'
            item = $(item);

            // populate vars with page content
            jobTitle = item.find('span.i-occ.strong.noMargVert').html().trim();
            salary = item.find('.meanPay').html().replace(selectNonNumeric, '');
            sampleSize = item.find('.salaryCount').html().replace(selectNonNumeric, '');

            // deal with hourly and monthly pay
            salaryFactor = jobTitle.indexOf('Hourly') >= 0 ? salaryFactor = 2000 : jobTitle.indexOf('Monthly') >= 0 ? 12 : 1;

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
                jobTitle: jobTitle.trim().replace(removeHourlyMonthly, ''),
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
