const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// GET AI insight for a specific region
router.get('/insights', aiController.getAIInsight);

module.exports = router;
