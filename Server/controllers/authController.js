// Server/controllers/authController.js
const User = require('../models/userModel'); // ← keep your path
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendOTPEmail = require('../utils/sendOTPEmail'); // ← one, consistent import

// helper
const genOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const now = () => Date.now();
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes

// REGISTER (accepts either username or name from frontend)
const registerUser = async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;

    if (!email || !password || !(username || name)) {
      return res.status(400).json({ message: 'username/name, email, password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

  //  const password = rawPassword.trim(); // Add this

    const hash = await bcrypt.hash(password, 10);
    const otpCode = genOtp();

    // set both username & name safely (schema will ignore unknown fields if strict)
    const doc = new User({
      username: username || name,
      name: name || username,
      email: email.toLowerCase(),
      password: hash,
      role: role || 'member',
      isVerified: false,
      otpCode,
      otpExpires: now() + OTP_TTL_MS,
    });

    await doc.save();
    await sendOTPEmail(email, otpCode);
    console.log(`Generated OTP for ${email}: ${otpCode}`);


    return res.status(201).json({ message: 'User registered. Please check your email for OTP.' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// VERIFY OTP (POST /verify-email)
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate request body
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Convert OTP to string (to avoid type mismatch issues)
    const otpStr = otp.toString().trim();
  //  const email = rawEmail.trim().toLowerCase() ; // Add this

    // Find user with matching email + otp, and ensure otp not expired
    const user = await User.findOne({
      email: email.toLowerCase(),
      otpCode: otpStr,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark user as verified & clear OTP fields
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Generate JWT token (valid for 7 days)
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Send response exactly how OTP screen expects
    return res.status(200).json({
      message: 'Email verified successfully. You can now log in.',
      token,
      role: user.role,
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


// LOGIN
const loginUser = async (req, res) => {
  try {
        console.log("Request Body:", req.body); // 👈 Add this line

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // If not verified, send OTP again
    if (!user.isVerified) {
      const otpCode = genOtp();
      user.otpCode = otpCode;
      user.otpExpires = Date.now() + OTP_TTL_MS; // ✅ Changed now() → Date.now()
      await user.save();

      await sendOTPEmail(email, otpCode);
      return res.status(200).json({ requireOTP: true, message: "OTP sent. Please verify." });
    }

    // ✅ Token generation
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login error:", err.message, err.stack);
    return res.status(500).json({ message: err.message });
  }
};


// RESEND

// FORGOT PASSWORD (send OTP for reset)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otpCode = genOtp();
    user.otpCode = otpCode;
    user.otpExpires = now() + OTP_TTL_MS;
    await user.save();

    await sendOTPEmail(email, otpCode);
    return res.status(200).json({ message: 'OTP sent to your email for password reset' });
  } catch (err) {
    console.error('Forgot Password Error:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// RESET PASSWORD (using OTP)
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword)
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });

    const user = await User.findOne({
      email: email.toLowerCase(),
      otpCode: otp,
      otpExpires: { $gt: now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    console.error('Reset Password Error:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerUser,
  verifyOTP,        // used by /verify-email and /verify-otp (both map to same handler)
  loginUser,
  forgotPassword,
  resetPassword,
};
