const express = require('express');
const router = express.Router();
const landInquiryController = require('../controllers/landInquiryController');
const { protect } = require('../middleware/authMiddleware');

// All inquiry routes require authentication
router.use(protect);

// Create a new inquiry
router.post('/', landInquiryController.createInquiry);

// Get inquiries for a land owner (Farmer view)
router.get('/owner', landInquiryController.getOwnerInquiries);

// Get inquiries sent by a buyer (Buyer view)
router.get('/my', landInquiryController.getBuyerInquiries);

// Update inquiry status
router.patch('/:id/status', landInquiryController.updateInquiryStatus);

module.exports = router;
