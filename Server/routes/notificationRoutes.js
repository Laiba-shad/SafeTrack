const express = require('express');
const { protect } = require('../middlewares/authMiddlewares');
const { getUserNotifications, markAsRead } = require('../controllers/notificationController');

const router = express.Router();

router.use(protect); 

router.get('/user/:userId', getUserNotifications);
router.put('/:notificationId/read', markAsRead);

module.exports = router;