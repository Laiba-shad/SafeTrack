const Circle = require('../models/Circle');
const JoinCode = require('../models/JoinCode');
const User = require('../models/userModel');
const crypto = require('crypto');

// Get current circle info for the logged-in user
exports.getCircleInfo = async (req, res) => {
  try {
    // The user ID is available in req.user.id from your middleware
    const userId = req.user.id;
    
    const user = await User.findById(userId).populate('circleId');
    if (!user.circleId) {
      return res.status(404).json({ message: "You are not part of any circle" });
    }
    
    return res.json({
      circle: user.circleId,
      isAdmin: user.circleId.admin.toString() === userId
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get current join code for the circle
exports.getCurrentJoinCode = async (req, res) => {
  try {
    const { circleId } = req.params;
    
    const circle = await Circle.findById(circleId);
    if (!circle) {
      return res.status(404).json({ message: "Circle not found" });
    }
    
    // Check if the user is the admin of this circle
    if (circle.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    // Find the latest active join code for this circle
    const joinCode = await JoinCode.findOne({ 
      circleId, 
      createdAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Not expired
    }).sort({ createdAt: -1 });
    
    return res.json({
      code: joinCode ? joinCode.code : null,
      circleName: circle.name
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
exports.getCircleById = async (req, res) => {
  try {
    const circle = await Circle.findById(req.params.id);
    
    if (!circle) {
      return res.status(404).json({ success: false, message: 'Circle not found' });
    }
    
    res.status(200).json({ success: true, circle });
  } catch (error) {
    console.error('Get circle error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch circle', error });
  }
};