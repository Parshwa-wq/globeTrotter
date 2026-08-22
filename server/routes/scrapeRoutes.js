const express = require('express');
const router = express.Router();
const scrapeController = require('../controllers/scrapeController');
const auth = require('../middleware/authMiddleware');

router.use(auth);

router.get('/route', scrapeController.getScrapedRoute);
router.post('/save/:tripId', scrapeController.saveRoute);
router.get('/saved/:tripId', scrapeController.getSavedRoute);
router.delete('/saved/:tripId', scrapeController.deleteSavedRoute);

module.exports = router;
