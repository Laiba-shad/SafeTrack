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
//router.post("/resend-otp", protect.resendOTP);

// Add to authRoutes.js
router.post('/test-password', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Test password comparison
    const isMatch = await bcrypt.compare(password, user.password);
    
    // Test hashing the same password
    const testHash = await bcrypt.hash(password, 10);
    const testMatch = await bcrypt.compare(password, testHash);
    
    return res.json({
      email: user.email,
      username: user.username,
      isVerified: user.isVerified,
      passwordMatch: isMatch,
      passwordHash: user.password, // Only for debugging
      testHash: testHash,
      testHashMatch: testMatch
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;