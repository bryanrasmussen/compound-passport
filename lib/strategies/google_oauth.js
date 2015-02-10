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
    console.log("this strategy is being called from bryan github v 3");
    console.log(JSON.stringify(conf));
    console.log(conf.google_oauth.clientID);
    var Strategy = require('passport-google-oauth').Strategy;
    passport.use(new Strategy({
          clientID: conf.google_oauth.clientID,
          clientSecret: conf.google_oauth.secret,
          callbackURL: conf.ssl_base + 'auth/google/callback'
    }, exports.callback));

    app.get('/auth/google',
        passport.authenticate('google_oauth'));
    app.get('/auth/google/callback',
        passport.authenticate('google_oauth', { failureRedirect: '/' }),
        exports.redirectOnSuccess);
};

