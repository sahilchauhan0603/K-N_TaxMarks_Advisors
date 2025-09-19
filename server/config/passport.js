const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google OAuth Profile:', profile);
    
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    
    if (user) {
      console.log('Existing Google user found:', user.email);
      return done(null, user);
    }
    
    // Check if user exists with same email
    user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      console.log('Linking Google account to existing user:', user.email);
      // Link Google account to existing user
      user.googleId = profile.id;
      user.isGoogleUser = true;
      await user.save();
      return done(null, user);
    }
    
    console.log('Creating new Google user:', profile.emails[0].value);
    
    // Create new user with Google data (incomplete profile)
    const newUser = new User({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      isGoogleUser: true,
      profileComplete: false, // Flag to indicate profile needs completion
      phone: '', // Initialize empty
      state: ''  // Initialize empty
    });
    
    const savedUser = await newUser.save();
    console.log('New Google user created:', savedUser.email);
    return done(null, savedUser);
  } catch (error) {
    console.error('Google OAuth Strategy Error:', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;