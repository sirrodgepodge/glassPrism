var router = require('express').Router(),
    mongoose = require('mongoose'),
    //bluebird = require('bluebird'),
    Job = mongoose.model('Job');

router.post('/', function(req, res, next) {
    console.log(req.body);
    Job.find().then(function(comments) {
        console.log(comments);
        res.json(comments);
    }).catch(function(err){
        console.log(err);
        res.json(err);
    });
});

module.exports = router;
