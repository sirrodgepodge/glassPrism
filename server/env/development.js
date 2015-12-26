module.exports = {
    "DATABASE_URI": "mongodb://heroku_td0vq43d:cat4c7f4mrr52ue6t71nhd8r60@ds053310.mongolab.com:53310/heroku_td0vq43d",
    "SESSION_SECRET": "shhhhhhhh",
    "GOOGLE": {
        "clientID": "527271872156-t8hifbimqcpeebe02gjptbpvf04ul2ad.apps.googleusercontent.com",
        "clientSecret": "X-RJD-DAQ4GnRgKXeX7jHfk4",
        "callbackURL": "http://localhost:1337/auth/google/callback"
    },
    "AWS": {
        "clientID": "placeholder",
        "clientSecret": "placeholder",
        "bucketName": "placeholder"
    }
};

// Connect to remote MongoDB with this command line string:
// mongo ds053310.mongolab.com:53310/heroku_td0vq43d -u heroku_td0vq43d -p cat4c7f4mrr52ue6t71nhd8r60
