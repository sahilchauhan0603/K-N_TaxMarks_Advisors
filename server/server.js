require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const connectDB = require('./db/dbConnection');

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

const googleAuthRoutes = require('./routes/googleAuth');

const trademarkForms = require('./routes/Forms/trademarkForms');
const businessForms = require('./routes/Forms/businessForms');
const taxForms = require('./routes/Forms/taxForms');
const gstForms = require('./routes/Forms/gstForms');
const itrForms = require('./routes/Forms/itrForms');

const settingsRouter = require('./routes/settings');
const contactRoutes = require('./routes/contact');
const testimonialsRoutes = require('./routes/testimonials');
const suggestionsRoutes = require('./routes/suggestions');
const servicesRoutes = require('./routes/services');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(cors({
  origin: true,              // Reflect the request origin
  credentials: true          // Allow cookies/authorization headers
}));

// Session middleware for passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Serve testimonial images statically
app.use('/uploads/testimonials', express.static(path.join(__dirname, 'uploads/testimonials')));

// Routes
app.use('/api', userRoutes);
app.use('/api/auth', googleAuthRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', trademarkForms);
app.use('/api', businessForms);
app.use('/api', taxForms);
app.use('/api', gstForms);
app.use('/api', itrForms);
app.use('/api/admin/settings', settingsRouter);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/services', servicesRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));