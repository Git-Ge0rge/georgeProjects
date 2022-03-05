const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const Profile = require('../models/profile');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK,
    },
    // THIS IS THE VERIFY Callback Fn.
    function (accessToken, refreshToken, googleProfile, cb) {
      /**
       * @prop {1- Fetch the user from the database and provide them back to Passport by calling}
       * @prop {1a - If the user does not exist, we have a new user! We will add them to the database and pass along this new user in the }
       * @prop {1b - If the user exists, then we will just sign them in}
       */

      console.log('VERIFY CALLBACK:', accessToken, refreshToken, googleProfile);
      
      // cb = (err, profile) => {
      //   window.localStorage.setItem('currentProfileId', profile._id)
      //   cb(err, profile)
      // }

      Profile.findOne({ googleId: googleProfile.id })
        .then((profile) => {
          // a returning user, we can just tell passport to sign them in
          if (profile) {
            if (profile.avatar) {
              return cb(null, profile);
            }
            profile.avatar = googleProfile.photos[0].value;
            profile.save().then((profile) => cb(null, profile));
          }

          // we have a new profile via OAuth!
          const newProfile = new Profile({
            name: googleProfile.displayName,
            email: googleProfile.emails[0].value,
            googleId: googleProfile.id,
            avatar: googleProfile.photos[0].value,
          });

          return newProfile.save();
        })
        .then((newProfile) => cb(null, newProfile))
        .catch((err) => cb(err));
    }
  )
);

passport.serializeUser(function(profile, done) {
    done(null, profile.id);
});

passport.deserializeUser(function(id, done) {
    Profile.findById(id, function(err, profile) {
      done(err, profile);
    });
  });
// fix function to be relevant to models