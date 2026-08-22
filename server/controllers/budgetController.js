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

        // Get total budget grouped by currency for this trip
        const [totalResult] = await db.query(
            `SELECT e.currency, SUM(e.amount) AS total
             FROM expenses e
             JOIN activities a ON e.activity_id = a.id
             JOIN stops s ON a.stop_id = s.id
             WHERE s.trip_id = ?
             GROUP BY e.currency`,
            [req.params.tripId]
        );

        // Get stops for the trip (without flawed budget summation, frontend handles FX)
        const [byStop] = await db.query(
            `SELECT s.id AS stop_id, s.stop_name
             FROM stops s
             WHERE s.trip_id = ?
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
                totals_by_currency: totalResult,
                by_stop: byStopDetailed
            }
        });
    } catch (error) {
        console.error('Error fetching budget:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
