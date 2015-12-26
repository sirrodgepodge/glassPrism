// var crypto = require('crypto');
// var ObjectId = mongoose.Schema.Types.ObjectId;
var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    google: {
        id: String
    },
    email: String,
    firstName: String,
    lastName: String,
    photo: String
});

mongoose.model('User', UserSchema);
