const express = require('express');
const {protect} = require('../middlewares/authMiddlewares')
const { getAllUsers } = require('../controllers/userController');
const { getUserProfile, updateUserProfile, changeEmail,changePassword , requestEmailChange,verifyEmailChange} = require('../controllers/userController');
const router = express.Router();

router.get('/all-users', getAllUsers);
router.use(protect);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/request-email-change', protect, requestEmailChange);
router.get('/verify-email-change', verifyEmailChange);
router.put('/change-password', protect, changePassword);

module.exports = router;