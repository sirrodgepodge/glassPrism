'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    industry: String
});

mongoose.model('Industry', schema);
