const db = require('../config/db');

// @route   GET /api/trips/:tripId/stops
// @desc    Get all stops for a trip
exports.getStopsForTrip = async (req, res) => {
    try {
        // Verify the trip belongs to the logged-in user
        const [trips] = await db.query('SELECT id FROM trips WHERE id = ? AND user_id = ?', [req.params.tripId, req.user.userId]);
        if (trips.length === 0) {
            return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
        }

        const [stops] = await db.query(
            'SELECT * FROM stops WHERE trip_id = ? ORDER BY arrival_date, sort_order',
            [req.params.tripId]
        );
        res.json({ success: true, count: stops.length, data: stops });
    } catch (error) {
        console.error('Error fetching stops:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   POST /api/trips/:tripId/stops
// @desc    Add a new stop to a trip
exports.addStop = async (req, res) => {
    try {
        const { stop_name, sort_order, arrival_date, departure_date } = req.body;

        // Verify trip ownership
        const [trips] = await db.query('SELECT id FROM trips WHERE id = ? AND user_id = ?', [req.params.tripId, req.user.userId]);
        if (trips.length === 0) {
            return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
        }

        const [result] = await db.query(
            'INSERT INTO stops (trip_id, stop_name, sort_order, arrival_date, departure_date) VALUES (?, ?, ?, ?, ?)',
            [req.params.tripId, stop_name, sort_order || 0, arrival_date, departure_date]
        );

        const [newStop] = await db.query('SELECT * FROM stops WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, message: 'Stop added!', data: newStop[0] });
    } catch (error) {
        console.error('Error adding stop:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   PUT /api/trips/:tripId/stops/:id
// @desc    Update a stop
exports.updateStop = async (req, res) => {
    try {
        const { stop_name, sort_order, arrival_date, departure_date } = req.body;

        // Verify trip ownership
        const [trips] = await db.query('SELECT id FROM trips WHERE id = ? AND user_id = ?', [req.params.tripId, req.user.userId]);
        if (trips.length === 0) {
            return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
        }

        // Verify stop exists and belongs to this trip
        const [existing] = await db.query('SELECT id FROM stops WHERE id = ? AND trip_id = ?', [req.params.id, req.params.tripId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Stop not found' });
        }

        await db.query(
            `UPDATE stops SET stop_name = COALESCE(?, stop_name),
             sort_order = COALESCE(?, sort_order),
             arrival_date = COALESCE(?, arrival_date), departure_date = COALESCE(?, departure_date)
             WHERE id = ? AND trip_id = ?`,
            [stop_name, sort_order, arrival_date, departure_date, req.params.id, req.params.tripId]
        );

        const [updated] = await db.query('SELECT * FROM stops WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Stop updated', data: updated[0] });
    } catch (error) {
        console.error('Error updating stop:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   DELETE /api/trips/:tripId/stops/:id
// @desc    Delete a stop
exports.deleteStop = async (req, res) => {
    try {
        // Verify trip ownership
        const [trips] = await db.query('SELECT id FROM trips WHERE id = ? AND user_id = ?', [req.params.tripId, req.user.userId]);
        if (trips.length === 0) {
            return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
        }

        const [existing] = await db.query('SELECT id FROM stops WHERE id = ? AND trip_id = ?', [req.params.id, req.params.tripId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Stop not found' });
        }

        await db.query('DELETE FROM stops WHERE id = ? AND trip_id = ?', [req.params.id, req.params.tripId]);
        res.json({ success: true, message: 'Stop deleted successfully' });
    } catch (error) {
        console.error('Error deleting stop:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
