const Registration = require('../models/Registration');
const db = require('../config/database');
const Event = require('../models/Event');

exports.submitRegistration = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.session.userId;

        console.log('🔄 Processing registration request:', { userId, eventId });

        if (!userId) {
            console.log('User not logged in');
            req.session.errorMessage = 'Please log in to register for events';
            return res.redirect('/login');
        }

        if (!eventId) {
            console.log('Event ID missing');
            req.session.errorMessage = 'Event ID is required';
            return res.redirect('/events');
        }

        // Check that the event exists...
        const eventCheck = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);
        if (eventCheck.rows.length === 0) {
            console.log('Event not found:', eventId);
            req.session.errorMessage = 'Event not found';
            return res.redirect('/events');
        }

        console.log('Event found:', eventCheck.rows[0].title);

        const registration = await Registration.createRegistration(userId, eventId);
        
        console.log('Registration successful:', registration);
        req.session.successMessage = `Successfully registered for "${eventCheck.rows[0].title}"!`;
        
        res.redirect('/my-registrations');
        
    } catch (error) {
        console.error('Error submitting registration:', error);
        
        if (error.message === 'User already registered for this event') {
            req.session.errorMessage = 'You are already registered for this event';
        } else if (error.message === 'User not found') {
            req.session.errorMessage = 'User not found. Please log in again.';
        } else if (error.message === 'Event not found') {
            req.session.errorMessage = 'Event not found';
        } else {
            req.session.errorMessage = 'Error processing registration: ' + error.message;
        }
        
        res.redirect('/events');
    }
};


exports.getMyRegistrations = async (req, res) => {
    try {
        const userId = req.session.userId;
        if (!userId) return res.redirect('/login');

        const registrations = await Registration.getRegistrationsByUserId(userId);

        res.render('my-registrations', { 
            registrations,
            username: req.session.username,
            successMessage: req.session.successMessage || null
        });

        delete req.session.successMessage;

    } catch (error) {
        console.error('Error fetching registrations:', error);
        res.render('error', { 
            message:'An error occurred while fetching recordings.',
            error
        });
    }
};


exports.cancelRegistration = async (req, res) => {
    try {
        const { registrationId } = req.body;
        const userId = req.session.userId;

        console.log('Attempting to cancel registration:', { registrationId, userId });

        if (!userId) {
            return res.redirect('/login');
        }

        if (!registrationId) {
            return res.render('error', { 
                message: 'Registration ID is required'
            });
        }

        const registrationResult = await db.query(
            'SELECT * FROM registrations WHERE id = $1 AND user_id = $2',
            [registrationId, userId]
        );

        if (registrationResult.rows.length === 0) {
            return res.render('error', { 
                message: 'Registration not found or you do not have permission to cancel it'
            });
        }

        await db.query('DELETE FROM registrations WHERE id = $1', [registrationId]);
        
        console.log('Registration cancelled successfully:', registrationId);
        
        req.session.successMessage = 'Registration cancelled successfully!';
        res.redirect('/my-registrations');
        
    } catch (error) {
        console.error('Error cancelling registration:', error);
        res.render('error', { 
            message: 'Error cancelling registration: ' + error.message
        });
    }
};