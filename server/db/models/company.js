'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    glassDoorId: {
        type: String,
        unique: true
    },
    industry: String,
    company: String,
    numberOfRatings: Number,
    overallRating: Number,
    ratingDescription: String,
    cultureAndValuesRating: Number,
    seniorLeadershipRating: Number,
    compensationAndBenefitsRating: Number,
    careerOpportunitiesRating: Number,
    workLifeBalanceRating: Number,
    pctRecommendToFriend: Number,
    ceoPctApprove: Number,
    ceoPctDisapprove: Number,
    ceoNumberOfRatings: Number,
    ceoTitle: String,
    ceoName: String,
    website: String,
    squareLogo: String
});

mongoose.model('Company', schema);
