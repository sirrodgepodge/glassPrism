'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    glassDoorId: {
        type: String,
        unique: true
    },
    name: String,
    website: String,
    industry: String,
    numberOfRatings: Number,
    squareLogo: String,
    overallRating: Number,
    ratingDescription: String,
    cultureAndValuesRating: Number,
    seniorLeadershipRating: Number,
    compensationAndBenefitsRating: Number,
    careerOpportunitiesRating: Number,
    workLifeBalanceRating: Number,
    recommendToFriendRating: Number,
    ceo: {
        pctDisapprove: Number,
        pctApprove: Number,
        numberOfRatings: Number,
        title: String,
        name: String
    },
    salaries: [{
        sampleSize: Number,
        highEnd: Number,
        lowEnd: Number,
        salary: Number,
        title: String
        //location
    }]
});

mongoose.model('Employer', schema);