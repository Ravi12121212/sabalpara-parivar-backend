const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: String,
  email: String,
  phone: String,
  passwordHash: String,
  createdAt: Date,
}, { _id: false });

module.exports = mongoose.model('User', UserSchema);
