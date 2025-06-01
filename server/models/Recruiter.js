const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  companyName: String,
  experience: String,
  profilePicture: String, // Base64
  profileComplete: { type: Boolean, default: false },
}, { timestamps: true });


module.exports = mongoose.model('Recruiter', recruiterSchema);
