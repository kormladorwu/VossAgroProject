const express = require('express');
const router = express.Router();
const landListingController = require('../controllers/landListingController');
const { protect } = require('../middleware/authMiddleware');

// GET all listings (Public)
router.get('/', landListingController.getAllListings);

// GET single listing (Public)
router.get('/:id', landListingController.getListingById);

// POST create listing (Protected)
router.post('/', protect, landListingController.createListing);

// DELETE listing (Protected, Owner only)
router.delete('/:id', protect, landListingController.deleteListing);

module.exports = router;
