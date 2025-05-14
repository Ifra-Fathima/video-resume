const express = require('express');
const Job = require('../models/Job');
const { uploadFile } = require('../utils/s3');

const router = express.Router();

// Recruiter posting a job
router.post('/post', async (req, res) => {
  const { recruiterId, title, description, hashtags } = req.body;
  const mediaFile = req.files?.media;

  const uploadResult = await uploadFile(mediaFile.tempFilePath, mediaFile.name);

  const job = await Job.create({
    recruiterId,
    title,
    description,
    hashtags: hashtags.split(','),
    mediaUrl: uploadResult.Location,
  });

  res.json(job);
});

// Search jobs by hashtag
router.get('/search', async (req, res) => {
  const { hashtag } = req.query;
  const jobs = await Job.find({ hashtags: hashtag });
  res.json(jobs);
});

module.exports = router;
