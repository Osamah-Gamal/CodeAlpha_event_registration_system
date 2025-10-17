const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const Event = require('../models/Event'); // تأكد من وجود هذا المودل

// Routes ...
router.get('/', eventController.getHomePage);
router.get('/events', eventController.getEventsPage);
router.get('/events/:id', eventController.getEventDetails);

//  API endpoints ...
router.get('/api/events', eventController.getAllEventsAPI);
router.get('/api/events/:id', eventController.getEventAPI);
router.post('/api/events/:id/register', eventController.submitRegistrationAPI);

module.exports = router;