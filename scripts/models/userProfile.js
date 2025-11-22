const mongoose = require('mongoose');

const UserProfileSchema = new mongoose.Schema({
  userId: String,
  village: String,
  name: String,
  totalFamilyMembers: Number,
  currentAddress: String,
  businessDetails: String,
  createdAt: Date,
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);
