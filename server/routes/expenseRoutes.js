const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams needed to get activityId from server.js
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/authMiddleware');
const validateRequest = require('../middleware/validator');
const { expenseRules } = require('../validations/rules');

router.use(auth);

router.route('/')
    .post(expenseRules, validateRequest, expenseController.addExpense);

router.route('/:id')
    .delete(expenseController.deleteExpense);

module.exports = router;
