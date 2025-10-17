const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { requireAuth } = require('../middleware/authMiddleware');

// Routes محمية تتطلب تسجيل الدخول
router.get('/my-registrations', requireAuth, registrationController.getMyRegistrations);
router.post('/register-event', requireAuth, registrationController.submitRegistration);
router.post('/cancel-registration', requireAuth, registrationController.cancelRegistration);

module.exports = router;