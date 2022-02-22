const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
    function(username, password, done) {
        let user = { name: "cu_user"};  // would call db to look up if connected to db
        if (username === user.name && password === "cu_rulez") {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }
));

exports.isAuthenticated = passport.authenticate('basic', { session: false} );