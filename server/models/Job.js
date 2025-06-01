// models/Job.js
const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
  title: String,
  company: String,
  description: String,
  experience: String,
  eligibility: String,
  package: String,
  deadline: Date,
  hashtags: [String],
  media: {
    data: Buffer,
    contentType: String
  },
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
