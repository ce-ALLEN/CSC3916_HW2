const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
opts.secretOrKey = process.env.SECRET_KEY;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        let user = db.find(jwt_payload.id);

        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    }
));

exports.isAuthenticated = passport.authenticate('jwt', { session: false} );
exports.secret = opts.secretOrKey;