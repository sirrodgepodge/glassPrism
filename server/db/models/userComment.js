const mongoose = require('mongoose');

const UserComment = new mongoose.Schema({
    text: String,
    author: String
});

mongoose.model('UserComment', UserComment);
