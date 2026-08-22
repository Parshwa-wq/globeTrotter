const db = require('../config/db');

// @route   GET /api/stops/:stopId/activities
// @desc    Get all activities for a stop
exports.getActivitiesForStop = async (req, res) => {
    try {
        const [activities] = await db.query(
            'SELECT * FROM activities WHERE stop_id = ? ORDER BY sort_order, start_time',
            [req.params.stopId]
        );
        res.json({ success: true, count: activities.length, data: activities });
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   POST /api/stops/:stopId/activities
// @desc    Add a new activity to a stop
exports.addActivity = async (req, res) => {
    try {
        const { title, description, category, start_time, end_time, sort_order } = req.body;

        // Verify the stop exists
        const [stops] = await db.query('SELECT id FROM stops WHERE id = ?', [req.params.stopId]);
        if (stops.length === 0) {
            return res.status(404).json({ success: false, message: 'Stop not found' });
        }

        const [result] = await db.query(
            'INSERT INTO activities (stop_id, title, description, category, start_time, end_time, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.params.stopId, title, description, category, start_time, end_time, sort_order || 0]
        );

        const [newActivity] = await db.query('SELECT * FROM activities WHERE id = ?', [result.insertId]);
        res.status(201).json({ success: true, message: 'Activity added!', data: newActivity[0] });
    } catch (error) {
        console.error('Error adding activity:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   PUT /api/stops/:stopId/activities/:id
// @desc    Update an activity
exports.updateActivity = async (req, res) => {
    try {
        const { title, description, category, start_time, end_time, sort_order } = req.body;

        const [existing] = await db.query('SELECT id FROM activities WHERE id = ? AND stop_id = ?', [req.params.id, req.params.stopId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }

        await db.query(
            `UPDATE activities SET title = COALESCE(?, title), description = COALESCE(?, description),
             category = COALESCE(?, category), start_time = COALESCE(?, start_time),
             end_time = COALESCE(?, end_time), sort_order = COALESCE(?, sort_order)
             WHERE id = ? AND stop_id = ?`,
            [title, description, category, start_time, end_time, sort_order, req.params.id, req.params.stopId]
        );

        const [updated] = await db.query('SELECT * FROM activities WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Activity updated', data: updated[0] });
    } catch (error) {
        console.error('Error updating activity:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   DELETE /api/stops/:stopId/activities/:id
// @desc    Delete an activity
exports.deleteActivity = async (req, res) => {
    try {
        const [existing] = await db.query('SELECT id FROM activities WHERE id = ? AND stop_id = ?', [req.params.id, req.params.stopId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Activity not found' });
        }

        await db.query('DELETE FROM activities WHERE id = ? AND stop_id = ?', [req.params.id, req.params.stopId]);
        res.json({ success: true, message: 'Activity deleted successfully' });
    } catch (error) {
        console.error('Error deleting activity:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
