const db = require('../config/db');

// @route   POST /api/activities/:activityId/expenses
// @desc    Add a new expense to an activity
exports.addExpense = async (req, res) => {
    try {
        const { description, amount, currency } = req.body;
        const { activityId } = req.params;

        const [result] = await db.query(
            'INSERT INTO expenses (activity_id, description, amount, currency) VALUES (?, ?, ?, ?)',
            [activityId, description, amount, currency || 'INR']
        );

        res.status(201).json({ success: true, message: 'Expense added!', expenseId: result.insertId });
    } catch (error) {
        console.error('Error adding expense:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   DELETE /api/activities/:activityId/expenses/:id
// @desc    Delete an expense
exports.deleteExpense = async (req, res) => {
    try {
        await db.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Expense deleted' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
