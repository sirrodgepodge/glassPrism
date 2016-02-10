var router = require('express').Router(),
    mongoose = require('mongoose'),
    //bluebird = require('bluebird'),
    Job = mongoose.model('Job');


router.get('/', function(req,res,next){
    Job.find().limit(500).then(function(jobs){
        console.log(jobs[0]);
        res.json(jobs);
    });
});

router.post('/', function(req, res, next) {
    //  req.body should be formatted like so:
    //  {
    //    industry: [selected industry strings],
    //    company: [selected company strings],
    //    jotTitle: [selected jobTitle strings]
    //  }
    //
    //  if the industry, company, or jobTitle array is empty or the property does not exist on the object
    //  then there will be no filter applied to query based on this property
    //

    const queryObj = {};
    if(req.body.industry && req.body.industry.length) queryObj.industry = {
      $in: req.body.industry
    };
    if(req.body.company && req.body.company.length) queryObj.name = {
      $in: req.body.company
    };
    if(req.body.jobTitle && req.body.jobTitle.length) queryObj.salaries = {
      $elemMatch: {
        title: {
          $in: req.body.jobTitle
        }
      }
    };

    Job.find(queryObj).limit(500)  // capping returned objects at 500 for performance
      .then((matchedCompanies) => res.json(matchedCompanies))
      .catch(err => console.log(err));
});

module.exports = router;
