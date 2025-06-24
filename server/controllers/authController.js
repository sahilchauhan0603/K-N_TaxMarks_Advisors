const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/mailer');

let otpStore = {}; // In-memory OTP store

// Login controller
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Register controller
exports.register = async (req, res) => {
  const { name, email, password, phone, state } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phone, state });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify OTP controller
exports.verifyOTP = async (req, res) => {
  const { email, otp, password, name, phone, state } = req.body;
  // Implement OTP verification logic here
  // For now, just register the user after OTP verification
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phone, state });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Send OTP controller
exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
  try {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;
    await sendMail(
      email,
      'Your OTP Code',
      `Your OTP code is: ${otp}. It is valid for 10 minutes.`,
      `<div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px;">
        <div style="max-width: 420px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); padding: 32px; text-align: center;">
          <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png' alt='Company Logo' style='height: 48px; margin-bottom: 16px;' />
          <h2 style='color: #2563eb; margin-bottom: 16px;'>Your OTP Code</h2>
          <div style='font-size: 2.5rem; font-weight: bold; color: #16a34a; letter-spacing: 6px; margin-bottom: 16px;'>${otp}</div>
          <p style='color: #333; margin-bottom: 8px;'>Enter this code to verify your email address. It is valid for <b>10 minutes</b>.</p>
          <div style='color: #64748b; font-size: 13px; margin-top: 24px;'>If you did not request this, please ignore this email.</div>
        </div>
      </div>`
    );
    res.status(200).json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// Forgot Password: Send OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;
    await sendMail(
      email,
      'Password Reset OTP',
      `Your password reset OTP is: ${otp}. It is valid for 10 minutes.`,
      `<div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px;">
        <div style="max-width: 420px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); padding: 32px; text-align: center;">
          <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png' alt='Company Logo' style='height: 48px; margin-bottom: 16px;' />
          <h2 style='color: #d97706; margin-bottom: 16px;'>Password Reset OTP</h2>
          <div style='font-size: 2.5rem; font-weight: bold; color: #ea580c; letter-spacing: 6px; margin-bottom: 16px;'>${otp}</div>
          <p style='color: #333; margin-bottom: 8px;'>Use this code to reset your password. It is valid for <b>10 minutes</b>.</p>
          <div style='color: #64748b; font-size: 13px; margin-top: 24px;'>If you did not request this, please ignore this email.</div>
        </div>
      </div>`
    );
    res.status(200).json({ success: true, message: 'OTP sent to email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

// Reset Password: Verify OTP and set new password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  try {
    if (!otpStore[email] || otpStore[email] !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    delete otpStore[email];
    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};
