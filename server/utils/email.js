const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

const sendVerificationEmail = (to, token) => {
  const url = `http://localhost:3000/api/auth/verify/${token}`;
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Verify your email',
    html: `<p>Click <a href="${url}">here</a> to verify your email</p>`
  });
};

module.exports = { sendVerificationEmail };
