var passport = require('passport');

exports.callback = function (request, accessToken, refreshToken, profile, done) {
    exports.User.findOrCreate({
        request: request,
        accessToken: accessToken,
        refreshToken: refreshToken,
        profile: profile
    }, function (err, user) {
        done(err, user);
    });
};

exports.init = function (conf, app) {
    var Strategy = require('passport-google-oauth').OAuth2Strategy;
    console.log(JSON.stringify(conf));
    console.log(JSON.stringify(app));
    passport.use(new Strategy({
          clientID: conf.google_oauth.clientID,
          clientSecret: conf.google_oauth.secret,
          passReqToCallback   : true,
          callbackURL: conf.ssl_base + 'auth/google/callback'
    }, exports.callback));

    app.get('/auth/google',
        passport.authenticate('google', {scope: conf.google_oauth.scope}));
    app.get('/auth/google/callback',
        passport.authenticate('google', {failureRedirect: '/' }),
        exports.redirectOnSuccess);
};

