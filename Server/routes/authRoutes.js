// Server/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs'); // Changed from import to require
const User = require('../models/userModel');
const {
  registerUser,
  verifyOTP,
  loginUser,
  forgotPassword,
  resetPassword,
  generateJoinCode,
  joinWithCode,
  joinCircle,
  resendOTP
} = require('../controllers/authController');
const { protect } = require("../middlewares/authMiddlewares");

const router = express.Router();

// make both endpoints work to match your app + past code
router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);   // ← keep an alias if you change frontend later
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post("/join-circle", joinCircle);          // Member joins circle
router.post("/generateJoinCode", generateJoinCode);


module.exports = router;