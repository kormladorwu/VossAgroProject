const express = require('express');
const router = express.Router();
const fundingApplicationController = require('../controllers/fundingApplicationController');
const { protect } = require('../middleware/authMiddleware');

// Apply for funding (Farmer)
router.post('/', protect, fundingApplicationController.applyForFunding);

// Get my applications (Farmer)
router.get('/my-applications', protect, fundingApplicationController.getMyApplications);

// Get applications for a program (Investor)
router.get('/program/:programId', protect, fundingApplicationController.getProgramApplications);

// Get all applications for provider (Investor)
router.get('/provider-applications', protect, fundingApplicationController.getProviderApplications);

// Update application status (Investor)
router.put('/:id/status', protect, fundingApplicationController.updateApplicationStatus);

module.exports = router;
