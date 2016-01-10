var router = require('express').Router(),
    mongoose = require('mongoose'),
    bluebird = require('bluebird'),
    UserComment = mongoose.model('UserComment');
    UserComment = bluebird.promisifyAll(UserComment);

router.get('/', function(req, res, next) {
    UserComment.find().then(function(comments) {
        console.log(comments);
        res.json(comments);
    }).catch(function(err){
        console.log(err);
    });
});

router.post('/', function(req, res, next) {
    UserComment.create({
        text: req.body.text,
        author: req.user ? (req.user.firstName + ' ' + req.user.lastName) : 'Anonymous'
    }).then(function(comment){
        res.json(comment);
    });
});

module.exports = router;
