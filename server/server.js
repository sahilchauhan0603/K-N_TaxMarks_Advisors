require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/dbConnection');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const adminRoutes = require('./routes/admin');
const trademarkForms = require('./routes/trademarkForms');
const businessForms = require('./routes/businessForms');
const taxForms = require('./routes/taxForms');
const settingsRouter = require('./routes/settings');
const testimonialsRoutes = require('./routes/testimonials');
const path = require('path');
const gstForms = require('./routes/gstForms');
const itrForms = require('./routes/itrForms');

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

// Serve testimonial images statically
app.use('/uploads/testimonials', express.static(path.join(__dirname, 'uploads/testimonials')));

// Routes
app.use('/api', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', trademarkForms);
app.use('/api', businessForms);
app.use('/api', taxForms);
app.use('/api', gstForms);
app.use('/api', itrForms);
app.use('/api/admin/settings', settingsRouter);
app.use('/api/testimonials', testimonialsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));