const passport = require('passport');
const User = require('./models/User');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
// const GoogleStrategy = require('passport-google').Strategy;

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'theowlsarenotwhattheyseem'
  }, function(jwt_payload, done) {
    User.findOne({_id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

passport.use(new LocalStrategy(
  {
    session: false
  },
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (!user.verifyPassword(password)) {
        return done(null, false);
      }

      return done(null, user);
    }).select('+password');
  }
));

// passport.use(new GoogleStrategy({
//     clientID:     "975315692116-mekfr5vq662noo8et8shq9u01vvbkdkc.apps.googleusercontent.com",
//     clientSecret: "p7VnoqoRh_6U2J63DqIFt2k9",
//     // callbackURL: "http://local:3000/auth/google/callback",
//     passReqToCallback   : false
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//     console.log(profile);
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return done(err, user);
//     });
//   }
// ));
