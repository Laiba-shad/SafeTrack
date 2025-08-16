// Server/routes/authRoutes.js
const express = require('express');
const {
  registerUser,
  verifyOTP,
  loginUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

const router = express.Router();

// make both endpoints work to match your app + past code
router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);   // ← keep an alias if you change frontend later
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
