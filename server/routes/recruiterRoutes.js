const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Recruiter = require('../models/Recruiter');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// POST /api/recruiters/profile
router.post('/profile', upload.single('profilePicture'), async (req, res) => {
  const { email, name, companyName, experience } = req.body;
  const profilePicture = req.file ? req.file.filename : null;

  try {
    let recruiter = await Recruiter.findOne({ email });
    if (recruiter) {
      recruiter.name = name;
      recruiter.companyName = companyName;
      recruiter.experience = experience;
      recruiter.profilePicture = profilePicture;
      recruiter.profileComplete = true;
      await recruiter.save();
    } else {
      recruiter = new Recruiter({
        email,
        name,
        companyName,
        experience,
        profilePicture,
        profileComplete: true
      });
      await recruiter.save();
    }
    res.status(200).json({ message: 'Profile updated successfully', recruiter });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/recruiters/:id/profile
router.get('/:id', async (req, res) => {
  try {
    const recruiter = await Recruiter.findById(req.params.id);
    if (!recruiter) return res.status(404).json({ message: 'Recruiter not found' });
    res.json(recruiter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
