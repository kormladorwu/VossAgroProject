const express = require('express');
const router = express.Router();
const fundingProgramController = require('../controllers/fundingProgramController');
const { protect } = require('../middleware/authMiddleware');

// GET all funding programs
router.get('/', fundingProgramController.getAllFundingPrograms);

// GET a single funding program by ID
router.get('/:id', fundingProgramController.getFundingProgramById);

// POST create a new funding program (requires authentication)
router.post('/', protect, fundingProgramController.createFundingProgram);

// PUT update a funding program by ID (requires authentication)
router.put('/:id', protect, fundingProgramController.updateFundingProgram);

// DELETE a funding program by ID (requires authentication)
router.delete('/:id', protect, fundingProgramController.deleteFundingProgram);

module.exports = router;
