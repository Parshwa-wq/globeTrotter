const { body } = require('express-validator');

// Auth Rules
exports.registerRules = [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }).withMessage('Name too long'),
    body('email').trim().isEmail().withMessage('Must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

exports.loginRules = [
    body('email').trim().isEmail().withMessage('Must be a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Trip Rules
exports.tripRules = [
    body('title').trim().notEmpty().withMessage('Trip title is required').isLength({ max: 200 }).withMessage('Title too long'),
    body('start_date').isISO8601().withMessage('Valid start date is required').custom((value) => {
        // Enforce no past dates (with some leeway for timezone differences, maybe just checking structure here is fine, 
        // but let's check date)
        const today = new Date();
        today.setHours(0,0,0,0);
        const start = new Date(value);
        if (start < today) {
            throw new Error('Start date cannot be in the past');
        }
        return true;
    }),
    body('end_date').isISO8601().withMessage('Valid end date is required').custom((value, { req }) => {
        const start = new Date(req.body.start_date);
        const end = new Date(value);
        if (end < start) {
            throw new Error('End date must be after or equal to start date');
        }
        return true;
    }),
    body('status').optional().isIn(['draft', 'planned', 'ongoing', 'completed']).withMessage('Invalid status'),
];

// Stop Rules
exports.stopRules = [
    body('city_name').trim().notEmpty().withMessage('City name is required').isLength({ max: 200 }),
    body('country').trim().notEmpty().withMessage('Country is required').isLength({ max: 100 }),
    body('day_number').isInt({ min: 1 }).withMessage('Day number must be a positive integer'),
    body('arrival_date').isISO8601().withMessage('Valid arrival date is required'),
    body('departure_date').isISO8601().withMessage('Valid departure date is required').custom((value, { req }) => {
        const arrival = new Date(req.body.arrival_date);
        const departure = new Date(value);
        if (departure < arrival) {
            throw new Error('Departure date must be after or equal to arrival date');
        }
        return true;
    }),
];

// Activity Rules
const VALID_CATEGORIES = ['sightseeing', 'food', 'adventure', 'shopping', 'transport', 'accommodation', 'nightlife', 'culture', 'other'];

exports.activityRules = [
    body('title').trim().notEmpty().withMessage('Activity title is required').isLength({ max: 200 }),
    body('category').isIn(VALID_CATEGORIES).withMessage('Invalid activity category'),
    body('start_time').optional({ checkFalsy: true }).matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Start time must be HH:MM format'),
    body('end_time').optional({ checkFalsy: true }).matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('End time must be HH:MM format').custom((value, { req }) => {
        if (req.body.start_time && value) {
            // Simple string comparison for HH:MM works well
            if (value < req.body.start_time) {
                throw new Error('End time must be after start time');
            }
        }
        return true;
    }),
];
