const express = require('express');
const multer = require('multer');
const Job = require('../models/Job');

const router = express.Router();

// Multer config
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/jobs/post
router.post('/post', upload.single('media'), async (req, res) => {
  try {
    const {
      recruiterId, title, company, description,
      experience, eligibility, package: salary,
      deadline, hashtags
    } = req.body;

    const newJob = new Job({
      recruiterId,
      title,
      company,
      description,
      experience,
      eligibility,
      salary,
      deadline,
      hashtags: hashtags.split(',').map(h => h.trim()),
      media: req.file ? {
        data: req.file.buffer,
        contentType: req.file.mimetype
      } : null
    });

    await newJob.save();
    res.status(201).json({ message: 'Job posted successfully' });
  } catch (err) {
    console.error('Error posting job:', err);
    res.status(500).json({ error: 'Failed to post job' });
  }
});

module.exports = router;
