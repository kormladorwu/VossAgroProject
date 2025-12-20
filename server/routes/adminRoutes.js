const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// All routes require authentication and super_admin role (checked in controller)
router.get('/stats', protect, adminController.getSystemStats);
router.get('/users', protect, adminController.getAllUsers);
router.put('/users/:id', protect, adminController.updateUserStatus);
router.post('/invite', protect, adminController.inviteAdmin);

module.exports = router;
