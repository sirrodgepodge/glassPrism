'use strict';

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var _ = require('lodash');
var User = mongoose.model('User');
var Admin = mongoose.model('Admin');

module.exports = function (app) {

    var facebookConfig = app.getValue('env').FACEBOOK;

    var facebookCredentials = {
        clientID: facebookConfig.clientID,
        clientSecret: facebookConfig.clientSecret,
        callbackURL: facebookConfig.callbackURL,
        profileFields: ['id', 'first_name', 'last_name', 'photos', 'email', 'profileUrl']
    };

    var verifyCallback = function (accessToken, refreshToken, profile, done) {

        User.findOne({
            'facebook.id': profile.id
            }).exec()
            .then(function (user) {
                if (user) {
                    return user;
                } else {
                    return User.findOne({
                        email: profile._json.email
                    }).exec().then(function(existingUser) {
                        var upsertUser = existingUser || new User();
                        upsertUser.email = user.email || profile._json.email;
                        upsertUser.firstName = user.firstName || profile._json.first_name;
                        upsertUser.lastName = user.lastName || profile._json.last_name;
                        upsertUser.photo = user.photo || profile._json.picture.data.url;
                        upsertUser.facebook = {
                            id: profile._json.id,
                            profileUrl: profile._json.link
                        };
                        return upsertUser.save();
                    });
                }
            }).then(function(userToLogin) {
                done(null, userToLogin);
            }, function (err) {
                console.error('Error creating user from Facebook authentication', err);
                done(err);
            });
    };

    passport.use(new FacebookStrategy(facebookCredentials, verifyCallback));

    app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email' ] }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function (req, res) {
            Admin.isAdmin(req.user).then(function(isAnAdmin){
                req.user = _.omit(req.user.toJSON(), ['password', 'salt']);
                req.admin = isAnAdmin;
                res.redirect('/');
            });
        });

};
