const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/email');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
      const { email, password, userType } = req.body;
      if (!email || !password || !userType) {
          return res.status(400).json({ success: false, message: 'All fields required' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ success: false, message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
          email,
          password: hashedPassword,
          userType,
          profileCompleted: false
      });

      await newUser.save();

      res.json({ success: true, message: 'User registered successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
  }
});



router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const decoded = jwt.verify(token, 'secretkey');
    await User.findByIdAndUpdate(decoded.userId, { isVerified: true });
    res.send('Email verified successfully! You can now log in.');
  } catch (err) {
    res.send('Invalid or expired verification link.');
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.status(400).json({ message: 'Invalid credentials or email not verified.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    res.json({ message: 'Login successful', userType: user.userType, userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
