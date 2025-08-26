const express = require('express');
const router = express.Router();
const { protect, adminMiddleware } = require('../middlewares/authMiddlewares');
const circleController = require('../controllers/circleController');
const { generateJoinCode } = require('../controllers/authController');
const {getCircleById} = require ('../controllers/circleController')
// All routes below require authentication
router.use(protect);

// All routes below require admin privileges
router.use(adminMiddleware);

router.get('/info', circleController.getCircleInfo);
router.get('/:circleId/join-code', circleController.getCurrentJoinCode);
router.post('/generate-join-code', generateJoinCode);
router.get('/:id', protect, getCircleById);

module.exports = router;