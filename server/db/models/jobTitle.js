'use strict';

var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    glassDoorId: {
        type: String,
        unique: true
    },
    industry: String,
    numberOfRatings: Number, // review, don't have at jobTitle level now
    overallRating: Number, // review, don't have this at jobTitle level now
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
        jobTitle: String
        // location, ideally would figure this out...
    }]
});

mongoose.model('Industry', schema);
