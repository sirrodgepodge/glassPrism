var requestify = require('requestify'),
    mongoose = require('mongoose'),
    startDb = require('../server/db'),
    Employer = mongoose.model('Employer'),
    fs = require('fs');

// trigger after db connection
startDb.then(function() {
    console.log('gotten here');
    return Employer.find({}).then(function(allEmployers) {
        console.log('gotten here too');
        var jobTitles = {
            jobs: []
        };
        allEmployers.forEach(function(emp) {
            emp.salaries.forEach(function(job) {
                jobTitles.jobs.push({
                    company: emp.name,
                    industry: emp.industry,
                    title: job.title,
                    sampleSize: job.sampleSize,
                    salary: job.salary
                });
            });
        });
        console.log('employers stringified');
        fs.writeFile('../browser/jobTitles.json', JSON.stringify(jobTitles), function() {
            console.log('done');
        });
    });
});
