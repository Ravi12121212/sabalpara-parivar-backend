const mongoose = require('mongoose');

const FamilyMemberSchema = new mongoose.Schema({
  userId: String,
  memberName: String,
  age: Number,
  std: String,
  resultImage: String,
  percentage: Number,
  createdAt: Date,
});

module.exports = mongoose.model('FamilyMember', FamilyMemberSchema);
