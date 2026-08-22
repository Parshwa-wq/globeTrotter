const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :tripId from parent
const stopController = require('../controllers/stopController');
const auth = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validator');
const { stopRules } = require('../validations/rules');

// All stop routes require authentication
router.use(auth);

router.route('/')
    .get(stopController.getStopsForTrip)
    .post(stopRules, validateRequest, stopController.addStop);

router.route('/:id')
    .put(stopRules, validateRequest, stopController.updateStop)
    .delete(stopController.deleteStop);

module.exports = router;
