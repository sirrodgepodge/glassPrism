'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var mongoose = require('mongoose');
var _ = require('lodash');
var User = mongoose.model('User');
var Admin = mongoose.model('Admin');

module.exports = function(app) {

    var googleConfig = app.getValue('env').GOOGLE;

    var googleCredentials = {
        clientID: googleConfig.clientID,
        clientSecret: googleConfig.clientSecret,
        callbackURL: googleConfig.callbackURL
    };

    var verifyCallback = function(accessToken, refreshToken, profile, done) {
        console.log(profile._json);
        User.findOne({
                'google.id': profile.id
            }).exec()
            .then(function(user) {
                if (user) {
                    return user;
                } else {
                    return User.findOne({
                        email: profile._json.email
                    }).exec().then(function(existingUser) {
                        var upsertUser = existingUser || new User();
                        upsertUser.email = upsertUser.email || profile._json.emails[0].value;
                        upsertUser.firstName = upsertUser.firstName || profile._json.name.givenName;
                        upsertUser.lastName = upsertUser.lastName || profile._json.name.familyName;
                        upsertUser.photo = upsertUser.photo || (!profile._json.image.isDefault ? profile._json.image.url: '');
                        upsertUser.google = {
                            id: profile.id
                        };
                        return upsertUser.save();
                    });
                }
            }).then(function(userToLogin) {
                done(null, userToLogin);
            }, function(err) {
                console.error('Error creating user from Google authentication', err);
                done(err);
            });
    };

    passport.use(new GoogleStrategy(googleCredentials, verifyCallback));

    app.get('/auth/google', passport.authenticate('google', {
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ]
    }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {failureRedirect: '/login'}),
        function(req, res) {
            Admin.isAdmin(req.user).then(function(isAnAdmin){
                req.user = _.omit(req.user.toJSON(), ['password', 'salt']);
                req.admin = isAnAdmin;
                res.redirect('/');
            });
        });

};
