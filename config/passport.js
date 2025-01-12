const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user_model');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: 'http://localhost:4000/api/auth/google/callback',
                passReqToCallback: true
            },
           async  (request, accessToken, refreshToken, profile, done)  =>{
            // console.log("Done function:", done); // Log the done function
            // console.log('Profile received:', profile);
                try {
                    let user = await User.findOne({ email: profile.emails[0].value });
                    const hashedPassword = await bcrypt.hash(profile.emails[0].value,10);
                    if (!user) {
                        // Create new user
                        // console.log('User not found, creating new user.');
                        user = new User({
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            profileImg: profile.photos[0]?.value,
                            password: hashedPassword // Google users don't need a password
                        });
                        await user.save();
                    }
                    // console.log('User found or created:', user);
                    return done(null, user); // Pass user to Passport
                } catch (err) {
                    return done(err, null); // Pass error to Passport
                }
            }
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
