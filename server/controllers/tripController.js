const db = require('../config/db');

// @route   GET /api/trips
// @desc    Get all trips for the logged-in user
exports.getAllTrips = async (req, res) => {
    try {
        const [trips] = await db.query('SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC', [req.user.userId]);
        res.json({ success: true, count: trips.length, data: trips });
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   POST /api/trips
// @desc    Create a new trip
exports.createTrip = async (req, res) => {
    try {
        const { title, description, start_date, end_date } = req.body;

        const [result] = await db.query(
            'INSERT INTO trips (user_id, title, description, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
            [req.user.userId, title, description, start_date, end_date]
        );

        res.status(201).json({ success: true, message: 'Trip created!', tripId: result.insertId });
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   GET /api/trips/:id
// @desc    Get a single trip by ID
exports.getTripById = async (req, res) => {
    try {
        const [trips] = await db.query('SELECT * FROM trips WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
        
        if (trips.length === 0) {
            return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
        }

        res.json({ success: true, data: trips[0] });
    } catch (error) {
        console.error('Error fetching trip:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   PUT /api/trips/:id
// @desc    Update a trip
exports.updateTrip = async (req, res) => {
    try {
        const { title, description, start_date, end_date, cover_image_url, status } = req.body;

        // Verify ownership first
        const [existing] = await db.query('SELECT id FROM trips WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
        }

        await db.query(
            `UPDATE trips SET title = COALESCE(?, title), description = COALESCE(?, description), 
             start_date = COALESCE(?, start_date), end_date = COALESCE(?, end_date), 
             cover_image_url = COALESCE(?, cover_image_url), status = COALESCE(?, status),
             updated_at = NOW()
             WHERE id = ? AND user_id = ?`,
            [title, description, start_date, end_date, cover_image_url, status, req.params.id, req.user.userId]
        );

        const [updated] = await db.query('SELECT * FROM trips WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Trip updated', data: updated[0] });
    } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   DELETE /api/trips/:id
// @desc    Delete a trip (cascades to stops, activities, expenses)
exports.deleteTrip = async (req, res) => {
    try {
        const [existing] = await db.query('SELECT id FROM trips WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
        }

        await db.query('DELETE FROM trips WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId]);
        res.json({ success: true, message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('Error deleting trip:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
