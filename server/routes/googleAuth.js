const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Test route to verify Google OAuth config
router.get('/test-config', (req, res) => {
  res.json({
    clientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
    callbackUrl: '/api/auth/google/callback',
    clientUrl: process.env.CLIENT_URL
  });
});

// Google OAuth login
router.get('/google', (req, res, next) => {
  console.log('Initiating Google OAuth...');
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account'
  })(req, res, next);
});

// Google OAuth callback
router.get('/google/callback', 
  (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        console.error('Google OAuth Error:', err);
        return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
      }
      if (!user) {
        console.error('Google OAuth: No user returned');
        return res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_failed`);
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return res.redirect(`${process.env.CLIENT_URL}/login?error=login_failed`);
        }
        
        try {
          const token = jwt.sign(
            { 
              userId: user._id, 
              email: user.email,
              profileComplete: user.profileComplete 
            }, 
            process.env.JWT_SECRET, 
            { expiresIn: '7d' }
          );

          console.log('User profile complete:', user.profileComplete);

          // If profile is incomplete, redirect to profile completion
          if (!user.profileComplete) {
            res.redirect(`${process.env.CLIENT_URL}/complete-profile?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
          } else {
            // Profile is complete, redirect to auth callback handler
            res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}`);
          }
        } catch (error) {
          console.error('Token generation error:', error);
          res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
        }
      });
    })(req, res, next);
  }
);

// Complete Google user profile
router.post('/complete-profile', async (req, res) => {
  try {
    const { token, phone, state } = req.body;
    
    if (!token || !phone || !state) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user profile
    user.phone = phone;
    user.state = state;
    user.profileComplete = true;
    await user.save();

    // Generate new token with updated profile status
    const newToken = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        profileComplete: true 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token: newToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        state: user.state
      }
    });
  } catch (error) {
    console.error('Complete profile error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;