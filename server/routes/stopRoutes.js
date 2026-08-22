const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :tripId from parent
const stopController = require('../controllers/stopController');
const auth = require('../middleware/authMiddleware');

// All stop routes require authentication
router.use(auth);

router.route('/')
    .get(stopController.getStopsForTrip)
    .post(stopController.addStop);

router.route('/:id')
    .put(stopController.updateStop)
    .delete(stopController.deleteStop);

module.exports = router;
