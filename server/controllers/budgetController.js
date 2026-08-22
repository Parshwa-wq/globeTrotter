const db = require('../config/db');

// @route   GET /api/trips/:tripId/budget
// @desc    Get budget breakdown for a trip (total + per-stop aggregation)
exports.getTripBudget = async (req, res) => {
    try {
        // Verify trip ownership
        const [trips] = await db.query('SELECT id FROM trips WHERE id = ? AND user_id = ?', [req.params.tripId, req.user.userId]);
        if (trips.length === 0) {
            return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
        }

        // Get total budget across all stops/activities/expenses for this trip
        const [totalResult] = await db.query(
            `SELECT COALESCE(SUM(e.amount), 0) AS total
             FROM expenses e
             JOIN activities a ON e.activity_id = a.id
             JOIN stops s ON a.stop_id = s.id
             WHERE s.trip_id = ?`,
            [req.params.tripId]
        );

        // Get budget breakdown by stop
        const [byStop] = await db.query(
            `SELECT s.id AS stop_id, s.stop_name, COALESCE(SUM(e.amount), 0) AS total
             FROM stops s
             LEFT JOIN activities a ON s.id = a.stop_id
             LEFT JOIN expenses e ON a.id = e.activity_id
             WHERE s.trip_id = ?
             GROUP BY s.id
             ORDER BY s.arrival_date, s.sort_order`,
            [req.params.tripId]
        );

        // Get detailed expenses for each stop
        const byStopDetailed = await Promise.all(
            byStop.map(async (stop) => {
                const [expenses] = await db.query(
                    `SELECT e.id, e.description, e.amount, e.currency, a.title AS activity_title, a.id AS activity_id
                     FROM expenses e
                     JOIN activities a ON e.activity_id = a.id
                     WHERE a.stop_id = ?
                     ORDER BY a.sort_order`,
                    [stop.stop_id]
                );
                return { ...stop, expenses };
            })
        );

        res.json({
            success: true,
            data: {
                total: parseFloat(totalResult[0].total),
                currency: 'INR',
                by_stop: byStopDetailed
            }
        });
    } catch (error) {
        console.error('Error fetching budget:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
