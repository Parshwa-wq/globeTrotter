const crypto = require('crypto');
const db = require('../config/db');

// @route   POST /api/share/:tripId
// @desc    Generate a shareable link for a trip (Auth required)
exports.generateShareLink = async (req, res) => {
    try {
        // Verify trip ownership
        const [trips] = await db.query('SELECT id FROM trips WHERE id = ? AND user_id = ?', [req.params.tripId, req.user.userId]);
        if (trips.length === 0) {
            return res.status(404).json({ success: false, message: 'Trip not found or unauthorized' });
        }

        // Check if an active share link already exists for this trip
        const [existingLinks] = await db.query(
            'SELECT share_id FROM shared_links WHERE trip_id = ? AND is_active = true',
            [req.params.tripId]
        );

        if (existingLinks.length > 0) {
            return res.json({
                success: true,
                message: 'Share link already exists',
                data: {
                    shareId: existingLinks[0].share_id,
                    link: `${req.protocol}://${req.get('host')}/api/share/${existingLinks[0].share_id}`
                }
            });
        }

        // Generate a new UUID for the share link
        const shareId = crypto.randomUUID();

        await db.query(
            'INSERT INTO shared_links (trip_id, share_id) VALUES (?, ?)',
            [req.params.tripId, shareId]
        );

        res.status(201).json({
            success: true,
            message: 'Share link generated!',
            data: {
                shareId,
                link: `${req.protocol}://${req.get('host')}/api/share/${shareId}`
            }
        });
    } catch (error) {
        console.error('Error generating share link:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   GET /api/share/:shareId
// @desc    Get a shared trip (Public, no auth needed)
exports.getSharedTrip = async (req, res) => {
    try {
        // Find the shared link
        const [links] = await db.query(
            'SELECT * FROM shared_links WHERE share_id = ? AND is_active = true',
            [req.params.shareId]
        );

        if (links.length === 0) {
            return res.status(404).json({ success: false, message: 'Shared link not found or expired' });
        }

        const tripId = links[0].trip_id;

        // Get the trip
        const [trips] = await db.query('SELECT * FROM trips WHERE id = ?', [tripId]);
        if (trips.length === 0) {
            return res.status(404).json({ success: false, message: 'Trip not found' });
        }

        // Get stops
        const [stops] = await db.query(
            'SELECT * FROM stops WHERE trip_id = ? ORDER BY sort_order, day_number',
            [tripId]
        );

        // Get activities for each stop
        const stopsWithActivities = await Promise.all(
            stops.map(async (stop) => {
                const [activities] = await db.query(
                    'SELECT * FROM activities WHERE stop_id = ? ORDER BY sort_order, start_time',
                    [stop.id]
                );
                return { ...stop, activities };
            })
        );

        res.json({
            success: true,
            data: {
                trip: trips[0],
                stops: stopsWithActivities
            }
        });
    } catch (error) {
        console.error('Error fetching shared trip:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   POST /api/share/:shareId/clone
// @desc    Clone a shared trip into the logged-in user's account (Auth required)
exports.cloneTrip = async (req, res) => {
    try {
        // Find the shared link
        const [links] = await db.query(
            'SELECT * FROM shared_links WHERE share_id = ? AND is_active = true',
            [req.params.shareId]
        );

        if (links.length === 0) {
            return res.status(404).json({ success: false, message: 'Shared link not found or expired' });
        }

        const originalTripId = links[0].trip_id;

        // Get original trip
        const [originalTrips] = await db.query('SELECT * FROM trips WHERE id = ?', [originalTripId]);
        if (originalTrips.length === 0) {
            return res.status(404).json({ success: false, message: 'Original trip not found' });
        }

        const original = originalTrips[0];

        // 1. Clone the trip
        const [tripResult] = await db.query(
            'INSERT INTO trips (user_id, title, description, start_date, end_date, cover_image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.userId, `${original.title} (Copy)`, original.description, original.start_date, original.end_date, original.cover_image_url, 'draft']
        );
        const newTripId = tripResult.insertId;

        // 2. Clone the stops
        const [originalStops] = await db.query('SELECT * FROM stops WHERE trip_id = ?', [originalTripId]);

        for (const stop of originalStops) {
            const [stopResult] = await db.query(
                'INSERT INTO stops (trip_id, city_name, country, day_number, sort_order, arrival_date, departure_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [newTripId, stop.city_name, stop.country, stop.day_number, stop.sort_order, stop.arrival_date, stop.departure_date]
            );
            const newStopId = stopResult.insertId;

            // 3. Clone activities for each stop
            const [originalActivities] = await db.query('SELECT * FROM activities WHERE stop_id = ?', [stop.id]);
            for (const activity of originalActivities) {
                await db.query(
                    'INSERT INTO activities (stop_id, title, description, category, start_time, end_time, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [newStopId, activity.title, activity.description, activity.category, activity.start_time, activity.end_time, activity.sort_order]
                );
            }
        }

        res.status(201).json({
            success: true,
            message: 'Trip cloned successfully!',
            data: { newTripId }
        });
    } catch (error) {
        console.error('Error cloning trip:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
