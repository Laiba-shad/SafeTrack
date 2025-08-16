const express = require('express');
const { getAllUsers } = require('../controllers/userController');
const router = express.Router();

router.get('/all-users', getAllUsers);
 //admin middleware later

module.exports = router;
