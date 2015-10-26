var mongoose = require('mongoose');

var UserComment = new mongoose.Schema({
    text: String,
    author: String
});

mongoose.model('UserComment', UserComment);
