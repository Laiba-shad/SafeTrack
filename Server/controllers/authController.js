const User = require("../models/userModel");
const Circle = require("../models/Circle");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const JoinCode = require("../models/JoinCode");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOTP(email, otp) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your account",
    text: `Your OTP is: ${otp}`,
  });
}

exports.registerUser = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ message: "No request body provided" });

    let { username, email, password, role, circleName, joinCode } = req.body;
    if (typeof email === "string") email = email.trim().toLowerCase();

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "Please Fill All Fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    if (role === "admin" && !circleName) {
      return res.status(400).json({ message: "Circle name is required for admins" });
    }
    if (role === "member" && !joinCode) {
      return res.status(400).json({ message: "Join code is required for members" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit

    const user = new User({
      username,
      email,
      password,
      role,
      otp,
      isVerified: false,
      ...(role === "member" && { tempJoinCode: joinCode })
    });

    await user.save();
    await sendOTP(email, otp);

    return res.status(201).json({
      message: "User registered. Verify OTP to continue.",
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    console.error("register error:", error);
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    if (!req.body) return res.status(400).json({ message: "No request body provided" });

    let { email, otp, circleName } = req.body;

    // Normalize
    if (typeof email === "string") email = email.trim().toLowerCase();
    if (typeof otp === "string") otp = otp.trim();

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp == null) {
      return res.status(400).json({ message: "No OTP set for this user" });
    }

    // Compare as strings to avoid number/string mismatch
    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null;

    // Role-specific handling
    if (user.role === "admin") {
      // Create a circle for admin
      const joinCode = crypto.randomBytes(3).toString("hex").toUpperCase();
      const circle = new Circle({
        name: circleName || `${user.username || "Admin"}'s Circle`,
        code: joinCode,
        admin: user._id,
        members: [user._id],
      });
      await circle.save();
      user.circleId = circle._id;
    } else if (user.role === "member") {
      // Member joins with tempJoinCode stored on registration
      if (!user.tempJoinCode) {
        return res.status(400).json({ message: "No join code found for member" });
      }
      const circle = await Circle.findOne({ code: user.tempJoinCode });
      if (!circle) return res.status(404).json({ message: "Invalid join code" });

      if (!circle.members.includes(user._id)) {
        circle.members.push(user._id);
        await circle.save();
      }

      user.circleId = circle._id;
      user.tempJoinCode = null;
    }

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        circleId: user.circleId ?? null,
      },
    });
  } catch (error) {
    console.error("verify-otp error:", error);
    return res.status(500).json({ message: "OTP verification failed", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    if (typeof email === "string") email = email.trim().toLowerCase();
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }
        
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your OTP first" });
    }
    
    const isMatch = await user.matchPassword(password);
     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    return res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        circleId: user.circleId ?? null,
      },
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};
// ----------------- JOIN CIRCLE (MEMBER) -----------------
// Server/controllers/authController.js
exports.joinCircle = async (req, res) => {
  try {
    const { joinCode } = req.body || {};
    if (!joinCode) {
      return res.status(400).json({ message: "joinCode is required" });
    }
    
    // Find the join code
    const codeDoc = await JoinCode.findOne({ code: joinCode });
    if (!codeDoc) {
      return res.status(404).json({ message: "Invalid join code" });
    }
    
    // Get the circle
    const circle = await Circle.findById(codeDoc.circleId);
    if (!circle) return res.status(404).json({ message: "Circle not found" });
    
    // Add user to circle if not already a member
    const userId = req.user.id; // From your middleware
    if (!circle.members.includes(userId)) {
      circle.members.push(userId);
      await circle.save();
    }
    
    // Update user's circleId
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.circleId = circle._id;
    await user.save();
    
    return res.json({ message: "Joined circle successfully", circle });
  } catch (error) {
    console.error("joinCircle error:", error);
    return res.status(500).json({ message: "Failed to join circle", error: error.message });
  }
};

// ----------------- GENERATE NEW JOIN CODE (ADMIN) -----------------
// Server/controllers/authController.js
exports.generateJoinCode = async (req, res) => {
  try {
    // The circleId should be in the request body
    const { circleId } = req.body || {};
    if (!circleId) return res.status(400).json({ message: "circleId is required" });
    
    const circle = await Circle.findById(circleId);
    if (!circle) return res.status(404).json({ message: "Circle not found" });
    
    // Check if the user is the admin of this circle
    if (circle.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. Only circle admins can generate join codes." });
    }
    
    // Generate a new code
    const newCode = crypto.randomBytes(3).toString("hex").toUpperCase();
    
    // Create a new join code document
    const joinCode = new JoinCode({
      code: newCode,
      adminId: req.user.id, // From your middleware
      circleId: circle._id
    });
    
    await joinCode.save();
    
    // Update the circle with the new code
    circle.code = newCode;
    await circle.save();
    
    return res.json({ message: "New join code generated", code: newCode });
  } catch (error) {
    console.error("generateJoinCode error:", error);
    return res.status(500).json({ message: "Failed to generate join code", error: error.message });
  }
};


exports.forgotPassword = async (req, res) => {
  try {
    let { email } = req.body || {};
    if (typeof email === "string") email = email.trim().toLowerCase();
    console.log("Forgot password request for:", email);
    
    if (!email) return res.status(400).json({ message: "Email is required" });
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(404).json({ message: "User not found" });
    }
    
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();
    
    console.log("Reset token generated:", otp);
    
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It will expire in 1 hour.`,
    });
    
    console.log("OTP sent to email");
    return res.json({ message: "OTP for password reset has been sent" });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};




exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body || {};
    console.log("Reset password request received");
    console.log("Token:", token);
    console.log("New password provided:", !!newPassword);
    
    if (!token || !newPassword) {
      console.log("Missing token or newPassword");
      return res.status(400).json({ message: "token and newPassword are required" });
    }
    
    console.log("Looking for user with reset token...");
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    
    if (!user) {
      console.log("Invalid or expired token");
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    
    console.log("User found:", user.email);
    
    // Set the plain password (will be hashed by pre-save hook)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    console.log("Password reset successful for user:", user.email);
    
    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    console.log("Generated JWT token for automatic login");
    
    return res.json({
      message: "Password reset successful",
      token: jwtToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        circleId: user.circleId ?? null,
      },
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({ message: "Failed to reset password", error: error.message });
  }
};