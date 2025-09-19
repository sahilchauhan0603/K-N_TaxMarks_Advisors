const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.isGoogleUser;
    },
  },
  phone: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  googleId: {
    type: String,
    sparse: true,
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  profileComplete: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
