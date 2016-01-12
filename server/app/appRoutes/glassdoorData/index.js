var router = require('express').Router(),
    mongoose = require('mongoose'),
    //bluebird = require('bluebird'),
    Job = mongoose.model('Job');


router.get('/', function(req,res,next){
    Job.find().then(function(jobs){
        console.log(jobs[0])
        res.json(jobs)
    })
})

router.post('/', function(req, res, next) {
    console.log(req.body.industry)
    Job.find({industry:req.body.industry[0]}).then(function(comments) {
        // console.log(comments);
        res.json(comments);
    })
    // .catch(function(err){
    //     console.log(err);
    //     res.json(err);
    // });
});

module.exports = router;
