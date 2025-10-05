const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Optional for backwards compatibility
  name: { type: String, required: true },
  role: { type: String, required: true },
  photoUrl: { type: String },
  service: { type: String, required: true },
  feedback: { type: String, required: true },
  isApproved: { type: Boolean, default: false }, // Admin approval for testimonials
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
