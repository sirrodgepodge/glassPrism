var Router = require('express').Router();

// include API routes here
Router.use('/admin', require('./admin'));
Router.use('/comment', require('./comment'));

// send error if route not found
Router.use(function (req, res) {
    res.status(404).end();
});

module.exports = Router;
