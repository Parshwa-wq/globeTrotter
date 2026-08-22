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
