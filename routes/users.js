const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// API routes for users
router.get('/api/users/:email', userController.getUserByEmail);
router.get('/api/users/:id/registrations', userController.getUserRegistrations);

module.exports = router;