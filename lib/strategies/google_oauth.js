var passport = require('passport');

exports.callback = function (identifier, profile, done) {
    exports.User.findOrCreate({
        openId: identifier,
        profile: profile
    }, function (err, user) {
        done(err, user);
    });
};

exports.init = function (conf, app) {
    console.log("this strategy is being called from bryan github");
    console.log(JSON.stringify(conf));
    var Strategy = require('passport-google').Strategy;
    passport.use(new Strategy({
        returnURL: conf.baseURL + 'auth/google/return',
        realm: conf.baseURL
    }, exports.callback));

    app.get('/auth/google',
        passport.authenticate('google'));
    app.get('/auth/google/return',
        passport.authenticate('google', { failureRedirect: '/' }),
        exports.redirectOnSuccess);
};

