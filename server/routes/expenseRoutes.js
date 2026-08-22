const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams needed to get activityId from server.js
const expenseController = require('../controllers/expenseController');
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.route('/')
    .post(expenseController.addExpense);

router.route('/:id')
    .delete(expenseController.deleteExpense);

module.exports = router;
