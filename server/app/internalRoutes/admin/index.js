var router = require('express').Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Admin = mongoose.model('Admin');
var fs = require('fs');

var path = require('path');
var filesPath = path.dirname(require.main);

router.post('/deleteuser', function(req, res, next) {
    User.findOne({
        'email': req.body.email
    }).then(function(userToDelete) {
        if (!userToDelete) {
            console.log("that email does not belong to a user!");
            var err = new Error("User Does not exist");
            err.status = '401';
            return next(err);
        } else {
            Admin.isAdmin(userToDelete).then(function(isAnAdmin) {
                if (isAnAdmin) {
                    console.log("User is an admin, can't delete");
                    var err = new Error("User is an admin, can't delete");
                    err.status = '401';
                    return next(err);
                } else {
                    userToDelete.remove();
                    console.log("User deleted");
                    return res.send("User deleted");
                }
            }).catch(function() {
                console.log("Mongo error finding admin user!");
                return next(err);
            });
        }
    });
});

router.post('/:userid', function(req, res, next) {
    User.findOne({
        'email': req.body.email
    }).then(function(newAdminUser) {
        if (!newAdminUser) {
            console.log("that email does not belong to a user");
            var err = new Error("User Does not exist");
            err.status = '401';
            return next(err);
        } else {
            Admin.isAdmin(newAdminUser).then(function(isAnAdmin) {
                if (isAnAdmin && req.body.addOrDelete === 'add') {
                    console.log("User is already admin");
                    var err = new Error("User is already admin");
                    err.status = '401';
                    return next(err);
                } else if (!isAnAdmin && req.body.addOrDelete === 'add') {
                    console.log(newAdminUser);
                    Admin.create({
                        _id: newAdminUser._id,
                        privilegesFrom: req.params.userid
                    }).then(function(err, obj) {
                        console.log("Admin user added");
                        return res.send("Admin user added");
                    }).catch(function() {
                        console.log("Mongo error adding admin user!");
                        console.log(err);
                        return next(err);
                    });
                } else if (isAnAdmin && req.body.addOrDelete === 'remove' && mongoose.adminEmails.indexOf(newAdminUser.email) === -1) {
                    Admin.findById(newAdminUser._id).then(function(foundUser) {
                        foundUser.remove();
                        console.log("Admin privileges removed");
                        return res.send("Admin privileges removed");
                    }).catch(function() {
                        console.log("Mongo error finding admin user!");
                        return next(err);
                    });
                } else {
                    console.log("User is either Super Admin or not an Admin");
                    var err = new Error("User is either Super Admin or not an Admin");
                    err.status = '404';
                    return next(err);
                }
            }).catch(function() {
                console.log("Mongo error finding admin user!");
                return next(err);
            });
        }
    });
});

module.exports = router;