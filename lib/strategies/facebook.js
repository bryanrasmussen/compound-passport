var passport = require('passport');

exports.callback = function(token, tokenSecret, profile, done) {
    exports.User.findOrCreate({
        facebookId: profile.id,
        profile: profile
    }, function (err, user) {
        return done(err, user);
    });
};

exports.init = function (conf, app) {
    var Strategy = require('passport-facebook').Strategy;
    passport.use(new Strategy({
        clientID: conf.facebook.apiKey,
        clientSecret: conf.facebook.secret,
        callbackURL: conf.baseURL + 'auth/facebook/callback'
    }, exports.callback));

    app.get('/auth/facebook',
        passport.authenticate('facebook', { authType: 'rerequest', scope: conf.facebook.scope ? conf.facebook.scope.split(' ') : [ 'public_profile,email' ] }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: conf.failureRedirect || '/thingswelove'
        }), exports.redirectOnSuccess);

};
