const express = require('express');
const router = express.Router();
const fundingController = require('../controllers/fundingController');
const { protect } = require('../middleware/authMiddleware');

// GET all programs (Public)
router.get('/', fundingController.getAllPrograms);

// GET single program (Public)
router.get('/:id', fundingController.getProgramById);

// POST create program (Protected, Investors only)
router.post('/', protect, fundingController.createProgram);

// DELETE program (Protected, Owner only)
router.delete('/:id', protect, fundingController.deleteProgram);

module.exports = router;
