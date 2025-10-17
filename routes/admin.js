const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAdmin } = require('../middleware/adminMiddleware');

// جميع routes تتطلب صلاحيات أدمن
router.get('/dashboard', requireAdmin, adminController.getAdminDashboard);
router.get('/users', requireAdmin, adminController.getUsersManagement);
router.get('/events', requireAdmin, adminController.getEventsManagement);

// إدارة المستخدمين
router.post('/users/:userId/role', requireAdmin, adminController.updateUserRole);
router.post('/users/:userId/delete', requireAdmin, adminController.deleteUser);

// إدارة الأحداث
router.post('/events/create', requireAdmin, adminController.createEvent);
router.post('/events/:eventId/delete', requireAdmin, adminController.deleteEvent);

module.exports = router;