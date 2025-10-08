const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  googleAuth,
  getMe,
  updatePreferences,
  addMatch,
  addPass,
  getMatches
} = require('../controllers/userController');

// Public routes
router.post('/auth/google', googleAuth);

// Protected routes
router.get('/me', protect, getMe);
router.put('/preferences', protect, updatePreferences);
router.post('/matches', protect, addMatch);
router.post('/passes', protect, addPass);
router.get('/matches', protect, getMatches);

module.exports = router;
