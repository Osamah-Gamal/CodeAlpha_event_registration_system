const User = require('../models/User');
const Event = require('../models/Event');
const db = require('../config/database');

//Admin Control Panel...
exports.getAdminDashboard = async (req, res) => {
    try {
        console.log('Loading admin dashboard...');
        
        const users = await User.getAllUsers();
        const events = await Event.getAllEvents();
        
        // statistics......
        const stats = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM users) as total_users,
                (SELECT COUNT(*) FROM events) as total_events,
                (SELECT COUNT(*) FROM registrations) as total_registrations
        `);

        console.log('📊 Stats:', stats.rows[0]);
        console.log('👥 Users:', users.length);
        console.log('📅 Events:', events.length);

        res.render('admin/dashboard', {
            layout: 'layouts/admin-layout',
            pageTitle: 'Admin Dashboard',
            currentPage: 'dashboard',
            stats: stats.rows[0],
            users: users,
            events: events,
            pageSubtitle: 'System Overview' 
        });
    } catch (error) {
        console.error('Error in admin dashboard:', error);
        res.render('error', { 
            message: 'Error loading admin dashboard: ' + error.message,
            pageTitle: 'Error'
        });
    }
};

// manage users.....
exports.getUsersManagement = async (req, res) => {
    try {
        console.log('Loading users management...');
        const users = await User.getAllUsers();
        
        console.log('Users found:', users.length);

        res.render('admin/users', {
            layout: 'layouts/admin-layout',
            pageTitle: 'User Management',
            currentPage: 'users',
            users: users
        });
    } catch (error) {
        console.error('Error in users management:', error);
        res.render('error', { 
            message: 'Error loading users management: ' + error.message,
            pageTitle: 'Error'
        });
    }
};

// Event management.... 
exports.getEventsManagement = async (req, res) => {
    try {
        console.log('Loading events management...');
        const events = await Event.getAllEvents();
        
        console.log('Events found:', events.length);

        res.render('admin/events', {
            layout: 'layouts/admin-layout',
            pageTitle: 'Event Management',
            currentPage: 'events',
            events: events
        });
    } catch (error) {
        console.error('Error in events management:', error);
        res.render('error', { 
            message: 'Error loading events management: ' + error.message,
            pageTitle: 'Error'
        });
    }
};

// Update user role.....
exports.updateUserRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        console.log('Updating user role:', { userId, role });

        await User.updateUserRole(userId, role);
        
        req.session.successMessage = 'User role updated successfully!';
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error updating user role:', error);
        req.session.errorMessage = 'Error updating user role: ' + error.message;
        res.redirect('/admin/users');
    }
};

// delete user...
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        console.log('Deleting user:', userId);

        // Prevent deletion of the last admin...
        const user = await User.findById(userId);
        if (user.role === 'admin') {
            const adminCount = await User.getAllUsers().then(users => 
                users.filter(u => u.role === 'admin').length
            );
            
            if (adminCount <= 1) {
                req.session.errorMessage = 'Cannot delete the last admin user';
                return res.redirect('/admin/users');
            }
        }

        await User.deleteUser(userId);
        
        req.session.successMessage = 'User deleted successfully!';
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error deleting user:', error);
        req.session.errorMessage = 'Error deleting user: ' + error.message;
        res.redirect('/admin/users');
    }
};

// Create a new event...
exports.createEvent = async (req, res) => {
    try {
        const { title, description, date, location, max_attendees } = req.body;
        
        console.log('Creating event:', { title, date, location });

        const result = await db.query(
            'INSERT INTO events (title, description, date, location, max_attendees) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, description, date, location, max_attendees || null]
        );

        req.session.successMessage = 'Event created successfully!';
        res.redirect('/admin/events');
    } catch (error) {
        console.error('Error creating event:', error);
        req.session.errorMessage = 'Error creating event: ' + error.message;
        res.redirect('/admin/events');
    }
};

// delete event...
exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        
        console.log('Deleting event:', eventId);

        await db.query('DELETE FROM events WHERE id = $1', [eventId]);

        req.session.successMessage = 'Event deleted successfully!';
        res.redirect('/admin/events');
    } catch (error) {
        console.error('Error deleting event:', error);
        req.session.errorMessage = 'Error deleting event: ' + error.message;
        res.redirect('/admin/events');
    }
};