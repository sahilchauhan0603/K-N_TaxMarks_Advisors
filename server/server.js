require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/dbConnection');
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

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

// Routes
app.use('/api', authRoutes);
app.use('/api/contact', contactRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Connect to MongoDB
connectDB();

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));