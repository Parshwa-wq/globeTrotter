const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const budgetController = require('../controllers/budgetController');
const auth = require('../middleware/authMiddleware');

// All trip routes must be protected by the auth middleware
router.use(auth);

router.route('/')
    .get(tripController.getAllTrips)
    .post(tripController.createTrip);

router.route('/:id')
    .get(tripController.getTripById)
    .put(tripController.updateTrip)
    .delete(tripController.deleteTrip);

// Budget aggregation for a specific trip
router.get('/:tripId/budget', budgetController.getTripBudget);

module.exports = router;
