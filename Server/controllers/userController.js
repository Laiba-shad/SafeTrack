const User = require('../models/userModel');

// no admin check later
// // just return list
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id username role'); // only send _id and username
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};
