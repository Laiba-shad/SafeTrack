const User = require('../models/userModel');
const Circle = require('../models/Circle');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id username role email');
    res.json({ success: true, users });
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    let circle = null;
    if (user.circleId) {
      circle = await Circle.findById(user.circleId);
    }
    
    res.status(200).json({ 
      success: true, 
      user,
      circle: circle ? { name: circle.name } : null
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile', error });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { username, phone, address, profileImage } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update fields only if they are provided
    if (username !== undefined) user.username = username;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (profileImage !== undefined) user.profileImage = profileImage;
    
    await user.save();
    
    // Return the updated user with all fields
    const updatedUser = await User.findById(user._id).select('-password');
    
    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Failed to update profile', error });
  }
};

exports.requestEmailChange = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Verify current password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }
    
    // Check if email is already in use by another user
    const existingUser = await User.findOne({ email, _id: { $ne: user._id } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email is already in use' });
    }
    
    // Generate a token for email verification
    const token = jwt.sign(
      { userId: user._id, newEmail: email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Create a verification URL
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
    
    // Send email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    const mailOptions = {
      to: email,
      subject: 'Verify your new email address',
      html: `
        <p>Hello ${user.username},</p>
        <p>Please click the link below to verify your new email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 1 hour.</p>
      `
    };
    
    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ success: false, message: 'Failed to send verification email' });
      }
      
      res.status(200).json({ 
        success: true, 
        message: 'Verification email sent to your new email address'
      });
    });
  } catch (error) {
    console.error('Request email change error:', error);
    res.status(500).json({ success: false, message: 'Failed to request email change', error });
  }
};

exports.verifyEmailChange = async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Update the user's email
    user.email = decoded.newEmail;
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Email updated successfully'
    });
  } catch (error) {
    console.error('Verify email change error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ success: false, message: 'Token expired' });
    }
    res.status(500).json({ success: false, message: 'Failed to verify email change', error });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: 'New password must be at least 8 characters' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect current password' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({ 
      success: true, 
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Failed to update password', error });
  }
};