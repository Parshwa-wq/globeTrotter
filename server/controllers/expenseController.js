const db = require('../config/db');

// @route   POST /api/activities/:activityId/expenses
// @desc    Add a new expense to an activity
exports.addExpense = async (req, res) => {
    try {
        const { description, amount, currency } = req.body;
        const { activityId } = req.params;

        // VERIFY OWNERSHIP: Does this activity belong to a trip owned by the current user?
        const [authCheck] = await db.query(
            `SELECT t.user_id FROM activities a
             JOIN stops s ON a.stop_id = s.id
             JOIN trips t ON s.trip_id = t.id
             WHERE a.id = ?`, [activityId]
        );

        if (authCheck.length === 0 || authCheck[0].user_id !== req.user.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized. You do not own this itinerary.' });
        }

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
        // VERIFY OWNERSHIP
        const [authCheck] = await db.query(
            `SELECT t.user_id FROM activities a
             JOIN stops s ON a.stop_id = s.id
             JOIN trips t ON s.trip_id = t.id
             WHERE a.id = ?`, [req.params.activityId]
        );

        if (authCheck.length === 0 || authCheck[0].user_id !== req.user.userId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this expense.' });
        }

        // Also ensure the expense belongs to the activity
        await db.query('DELETE FROM expenses WHERE id = ? AND activity_id = ?', [req.params.id, req.params.activityId]);
        res.json({ success: true, message: 'Expense deleted' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
