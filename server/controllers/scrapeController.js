const { spawn } = require('child_process');
const path = require('path');

// @route   GET /api/scrape/route?from=X&to=Y&mode=Z
// @desc    Run the Python scraper to get route details and check for anomalies (like cars over oceans)
exports.getScrapedRoute = (req, res) => {
    const { from, to, mode } = req.query;

    if (!from || !to || !mode) {
        return res.status(400).json({ success: false, message: 'Missing from, to, or mode parameters' });
    }

    const scriptPath = path.join(__dirname, '..', 'scripts', 'route_scraper.py');
    
    // Spawn the Python process
    const pythonProcess = spawn('python3', [scriptPath, from, to, mode]);

    let dataString = '';

    pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`Python Scraper Error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
        try {
            const result = JSON.parse(dataString);
            if (!result.success) {
                return res.status(400).json(result);
            }
            res.json(result);
        } catch (error) {
            console.error('Error parsing Python output:', error);
            res.status(500).json({ success: false, message: 'Scraper engine failed' });
        }
    });
};

// @route   POST /api/scrape/save/:tripId
// @desc    Save a generated route permanently to the database
exports.saveRoute = async (req, res) => {
    const { tripId } = req.params;
    const { origin, destination, mode, stations } = req.body;
    
    try {
        const db = require('../config/db');
        // Delete any existing route for this trip to replace it
        await db.query('DELETE FROM trip_routes WHERE trip_id = ?', [tripId]);
        
        await db.query(
            'INSERT INTO trip_routes (trip_id, origin, destination, mode, stations_json) VALUES (?, ?, ?, ?, ?)',
            [tripId, origin, destination, mode, JSON.stringify(stations)]
        );
        
        res.json({ success: true, message: 'Route permanently locked in.' });
    } catch (error) {
        console.error('Error saving route:', error);
        res.status(500).json({ success: false, message: 'Failed to save route to database' });
    }
};

// @route   GET /api/scrape/saved/:tripId
// @desc    Fetch a permanently saved route for a trip
exports.getSavedRoute = async (req, res) => {
    const { tripId } = req.params;
    try {
        const db = require('../config/db');
        const [routes] = await db.query('SELECT * FROM trip_routes WHERE trip_id = ?', [tripId]);
        if (routes.length === 0) {
            return res.json({ success: true, data: null });
        }
        const route = routes[0];
        route.stations_json = typeof route.stations_json === 'string' ? JSON.parse(route.stations_json) : route.stations_json;
        res.json({ success: true, data: route });
    } catch (error) {
        console.error('Error fetching saved route:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch saved route' });
    }
};

// @route   DELETE /api/scrape/saved/:tripId
// @desc    Delete a permanently saved route
exports.deleteSavedRoute = async (req, res) => {
    const { tripId } = req.params;
    try {
        const db = require('../config/db');
        await db.query('DELETE FROM trip_routes WHERE trip_id = ?', [tripId]);
        res.json({ success: true, message: 'Route deleted' });
    } catch (error) {
        res.status(500).json({ success: false });
    }
};
