const path = require('path');

module.exports = function(app) {
    app.get('/chronpull', function(req, res) {
        require(path.join(app.getValue('root'), 'scrapingGlass'));
        res.status(200).send('runnin it :)');
    });
};
