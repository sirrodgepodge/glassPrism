var crypto = require('crypto');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = new mongoose.Schema({
    google: {
        id: String
    },
    email: String,
    firstName: String,
    lastName: String,
    photo: String,
    apps: [{
        name: String,
        zipUrl: String,
        htmlStr: String,
        cssCombined: String,
        imageURLs: [String]
    }]
});


mongoose.model('User', UserSchema);
