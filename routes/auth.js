const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { redirectIfAuth } = require('../middleware/authMiddleware');

// Routes للمصادقة
router.get('/register', redirectIfAuth, authController.showRegister);
router.post('/register', redirectIfAuth, authController.register);
router.get('/login', redirectIfAuth, authController.showLogin);
router.post('/login', redirectIfAuth, authController.login);
router.post('/logout', authController.logout);

module.exports = router;