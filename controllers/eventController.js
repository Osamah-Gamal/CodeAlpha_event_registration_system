const Event = require('../models/Event');

exports.getHomePage = (req, res) => {
    res.render('index');
};

exports.getEventsPage = async (req, res) => {
    try {
        const events = await Event.getAllEvents();
        
        // message succ...
        const successMessage = req.session.successMessage;
        delete req.session.successMessage;
        
        res.render('events', { 
            events: events,
            successMessage: successMessage,
        });
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).render('error', { 
            message: 'Failed to load events'
        });
    }
};

exports.getEventDetails = async (req, res) => {
    try {
        const eventId = req.params.id;
        console.log('🔍 Fetching event details for ID:', eventId);
        
        const event = await Event.getEventById(eventId);
        
        if (!event) {
            console.log('Event not found for ID:', eventId);
            return res.status(404).render('error', { 
                message: 'Event not found'
            });
        }
        
        console.log('Event found:', event.title);
        
        res.render('event-details', { 
            event: event,
            username: req.session.username 
        });
    } catch (err) {
        console.error('Error fetching event details:', err);
        res.status(500).render('error', { 
            message: 'Failed to load event details: ' + err.message
        });
    }
};



// API endpoint -view events list-...
exports.getAllEventsAPI = async (req, res) => {
    try {
        const events = await Event.getAllEvents();
        res.json({
            success: true,
            data: events,
            count: events.length
        });
    } catch (err) {
        console.error('Error in getAllEventsAPI:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch events',
            message: err.message
        });
    }
};

// API endpoint -detiles event-...
exports.getEventAPI = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.getEventById(eventId);
        
        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }
        
        res.json({
            success: true,
            data: event
        });
    } catch (err) {
        console.error('Error in getEventAPI:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch event',
            message: err.message
        });
    }
};

//  API endpoint -to submit the form- .... 
exports.submitRegistrationAPI = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId, name, email } = req.body;

        console.log('🔄 API Registration request:', { eventId, userId, name, email });

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'User authentication required'
            });
        }

        if (!eventId) {
            return res.status(400).json({
                success: false,
                error: 'Event ID is required'
            });
        }

        // check events if found ...
        const event = await Event.getEventById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                error: 'Event not found'
            });
        }

        // registration model.. 
        const Registration = require('../models/Registration');
        const registration = await Registration.createRegistration(userId, eventId);
        
        console.log('API Registration successful:', registration);
        
        res.status(201).json({
            success: true,
            message: `Successfully registered for "${event.title}"!`,
            data: registration
        });
        
    } catch (error) {
        // error state....
        console.error('Error in submitRegistrationAPI:', error);
        
        let statusCode = 500;
        let errorMessage = 'Error processing registration';
        
        if (error.message === 'User already registered for this event') {
            statusCode = 409;
            errorMessage = 'You are already registered for this event';
        } else if (error.message === 'User not found') {
            statusCode = 404;
            errorMessage = 'User not found';
        } else if (error.message === 'Event not found') {
            statusCode = 404;
            errorMessage = 'Event not found';
        }
        
        res.status(statusCode).json({
            success: false,
            error: errorMessage,
            message: error.message
        });
    }
};