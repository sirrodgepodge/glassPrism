module.exports = function(app) {
    require('./authentication')(app);
    require('./chronPull')(app);
};
