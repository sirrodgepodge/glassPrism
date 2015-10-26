var mongoose = require('mongoose'),
    shortid = require('shortid');

var Admin = new mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    privilegesFrom: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

//Create super-Admins
mongoose.adminEmails = [
    'rwcbeaman@gmail.com'
];

Admin.static('isAdmin', function(user) {
    return this.findById(user._id)
    .then(function(result) {
        return mongoose.adminEmails.indexOf(user.email) !== -1 || !!result;
    }).then(function(isItGood){
        return isItGood;
    });
});

mongoose.model('Admin', Admin);
