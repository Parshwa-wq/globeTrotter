const express = require('express');
const router = express.Router();
const shareController = require('../controllers/shareController');
const auth = require('../middleware/authMiddleware');

// Generate a share link (Auth required)
router.post('/:tripId', auth, shareController.generateShareLink);

// Get a shared trip (Public — no auth)
router.get('/:shareId', shareController.getSharedTrip);

// Clone a shared trip (Auth required)
router.post('/:shareId/clone', auth, shareController.cloneTrip);

module.exports = router;
