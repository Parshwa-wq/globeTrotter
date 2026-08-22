const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to access :stopId from parent
const activityController = require('../controllers/activityController');
const auth = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validator');
const { activityRules } = require('../validations/rules');

// All activity routes require authentication
router.use(auth);

router.route('/')
    .get(activityController.getActivitiesForStop)
    .post(activityRules, validateRequest, activityController.addActivity);

router.route('/:id')
    .put(activityRules, validateRequest, activityController.updateActivity)
    .delete(activityController.deleteActivity);

module.exports = router;
