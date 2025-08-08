// === utils/transporter.js ===
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendVerificationEmail = async (email, url) => {
  return transporter.sendMail({
    to: email,
    subject: 'Verify Your Email',
    html: `Please click <a href="${url}">here</a> to verify your email.`,
  });
};

const sendResetPasswordEmail = async (email, url) => {
  return transporter.sendMail({
    to: email,
    subject: 'Password Reset',
    html: `Click <a href="${url}">here</a> to reset your password.`,
  });
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};