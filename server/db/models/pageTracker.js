'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    pageNumber: Number
});

mongoose.model('PageTracker', schema);
