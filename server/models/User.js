const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  userType: { type: String, enum: ['recruiter', 'jobseeker'] },
  isVerified: { type: Boolean, default: true },
  profile: {
    company: String,
    experience: String,
    skills: [String],
    hashtags: [String],
    media: String, // image/video url
  },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('User', userSchema);
