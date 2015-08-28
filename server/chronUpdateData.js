var requestify = require('requestify');

var queryObj = {
    "t.p": 42120,
    "t.k": "gHxlKTuKw6S",
    userip: "0.0.0.0",
    useragent: "",
    format: "json",
    v: 1,
    action: "jobs-stats",
    returnStates: true,
    returnCities: true,
    returnEmployers: true,
    returnJobTitles: true,
    admLevelRequested: 1,
    jobType: "fulltime",
    fromAge: 14,
    country: "United States",
    state: "New York",
    city: "New York, NY"
};

console.log(Object.keys(queryObj).length);

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
        console.log(response.getBody().response);

        // get the response headers
        // response.getHeaders();

        // // get specific response header
        // response.getHeader('Accept');

        // // get the code
        // response.getCode();
    });


// var baseUrl = "http://api.glassdoor.com/api/api.htm?t.p=5317&t.k=n07aR34Lk3Y&userip=0.0.0.0&useragent=&format=json";

// var version = "&v=1";
// var action = "&action=jobs-stats";
// var returnStates = "&returnStates=true";
// var admLevelRequestion = "&admLevelRequested=1";

// We need this to build our post string
// var querystring = require('querystring');
// var http = require('http');
// var fs = require('fs');

// (function PostCode(codestring) {
//   // Build the post string from an object
//   var query_data = querystring.stringify({
//       'compilation_level' : 'ADVANCED_OPTIMIZATIONS',
//       'output_format': 'json',
//       'output_info': 'compiled_code',
//         'warning_level' : 'QUIET',
//         'js_code' : codestring
//   });

//   // An object of options to indicate where to post to
//   var options = {
//       host: 'api.glassdoor.com',
//       port: '80',
//       path: '/api/api.htm',
//       method: 'GET',
//       headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           'Content-Length': query_data.length
//       }
//   };

//   // Set up the request
//   var post_req = http.request(options, function(res) {
//       res.setEncoding('utf8');
//       res.on('data', function (chunk) {
//           console.log('Response: ' + chunk);
//       });
//   });

//   // post the data
//   console.log(post_data);
//   post_req.write(post_data);
//   post_req.end();

// })();
