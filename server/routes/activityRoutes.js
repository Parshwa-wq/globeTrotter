const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :stopId from parent
const activityController = require('../controllers/activityController');
const auth = require('../middleware/authMiddleware');

// All activity routes require authentication
router.use(auth);

router.route('/')
    .get(activityController.getActivitiesForStop)
    .post(activityController.addActivity);

router.route('/:id')
    .put(activityController.updateActivity)
    .delete(activityController.deleteActivity);

module.exports = router;
