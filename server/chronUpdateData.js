var requestify = require('requestify'),
    cheerio = require('cheerio'),
    startDb = require('./db');

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

var queryObj = {
    "t.p": 42120,
    "t.k": "gHxlKTuKw6S",
    userip: "0.0.0.0",
    useragent: "",
    format: "json",
    v: 1,
    action: "employers",
    country: "United States",
    state: "New York",
    city: "New York, NY",
    //l: "New York, NY",
    q: "google"
};

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
        params: queryObj
    })
    .then(function(response) {
        // get the response body
        //var id = /(?:sqll\/)(\d+)/g.exec(response.getBody().response.employers[0].ceo.image.src)[1];
        //console.log(response.getBody().response);
        var employers = response.getBody().response.employers.slice(0, 2);
        console.log(employers);

        employers.forEach(function(val, index) {
            var id = val.id;
            var name = val.name.replace(' ', '-');

            //console.log(id, ' separate');
            console.log(id, ' separator ', name);

            //store output data in array here
            val.salaries = [];

            pullToArray(val.salaries, name, id, '', function recurseCallBack(newPage) {
                console.log(newPage);
                if (newPage) {
                    pullToArray(val.salaries, name, id, newPage, recurseCallBack);
                } else {
                    employers[index] = val;
                    //console.log(employers);
                    console.log('done');
                }
            });
        });

    }).catch(function(err) {
        console.log(err);
    });



function pullToArray(dataArr, name, id, page, cb) {
    requestify.get('http://www.glassdoor.com/Salary/' + name + '-Salaries-E' + id + page + '.htm').then(function(html) {

        //load response into cheerio, i.e. server jQuery
        var $ = cheerio.load(html.getBody());

        //detect if this is the last page, if not store next page string
        lastPage = !!$('.pagingControls ul .current.last').html() ? true : false;
        page = !page.length ? '_P2' : lastPage ? null : '_P' + (+page.slice(2) + 1);

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
        var removeNonDigits = /\D+/g;
        var removeHourlyMonthly = /\s-\s(hourly|monthly|contractor|hourly contractor)/ig;
        var findNA = /n\/a/i;

        jobSections.each(function(i, item) {
            //jQuery-ify 'item'
            item = $(item);

            //populate vars with page content
            title = item.find('span.i-occ.strong.noMargVert').html().trim();
            salary = item.find('.meanPay').html();
            sampleSize = item.find('.salaryCount').html().trim();

            //deal with hourly and monthly pay            
            salaryFactor = title.indexOf('Hourly') >= 0 ? salaryFactor = 2000 : title.indexOf('Monthly') >= 0 ? 12 : 1;

            //store low end and high end of range
            lowEnd = item.find('.rangeValues .alignLt').html().replace(removeNonDigits, '') *
                salaryFactor * (salaryFactor < 2000 ? 1000 : 1);
            highEnd = item.find('.rangeValues .alignRt').html().replace(removeNonDigits, '') *
                salaryFactor * (salaryFactor < 2000 ? 1000 : 1);

            //handles if salary is "n/a"
            if (findNA.test(salary)) salary = (lowEnd + highEnd) / 2;
            else salary = salary.replace(removeNonDigits, '') * salaryFactor;

            dataArr.push({
                title: title.trim().replace(removeHourlyMonthly, ''),
                salary: salary,
                lowEnd: lowEnd,
                highEnd: highEnd,
                sampleSize: +sampleSize.slice(0, sampleSize.indexOf(' '))
            });
        });
        if (cb) cb(page);
        //console.log(dataArr);
    });
}