const Notification = require('../models/notificationModel');

const createNotification = async (recipientId, senderId, type, message, taskId) => {
  try {
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      message,
      taskId
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ recipient: userId })
      .populate('sender', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch notifications', error });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to mark as read', error });
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead
};