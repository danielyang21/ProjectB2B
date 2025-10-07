const express = require('express');
const router = express.Router();
const { compareCompanies, matchCompanies } = require('../controllers/aiController');

// POST /api/ai/match-companies - Match companies based on user prompt
router.post('/match-companies', matchCompanies);

// POST /api/ai/compare - Generate AI comparison
router.post('/compare', compareCompanies);

module.exports = router;
