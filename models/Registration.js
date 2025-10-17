const db = require('../config/database');

class Registration {
    // create rege....
     static async createRegistration(userId, eventId) {
        try {
            console.log('Creating registration:', { userId, eventId });
            
            // check is not null....
            if (!userId || !eventId) {
                throw new Error('User ID and Event ID are required');
            }

            // check from user and event are they exsit ...
            const userCheck = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
            const eventCheck = await db.query('SELECT * FROM events WHERE id = $1', [eventId]);

            if (userCheck.rows.length === 0) {
                throw new Error('User not found');
            }

            if (eventCheck.rows.length === 0) {
                throw new Error('Event not found');
            }

            // check the regester if exist before...
            const existingRegistration = await db.query(
                'SELECT * FROM registrations WHERE user_id = $1 AND event_id = $2',
                [userId, eventId]
            );

            if (existingRegistration.rows.length > 0) {
                throw new Error('User already registered for this event');
            }

            // create a new reg...
            const result = await db.query(
                'INSERT INTO registrations (user_id, event_id, registration_date) VALUES ($1, $2, $3) RETURNING *',
                [userId, eventId, new Date()]
            );
            
            console.log('Registration created successfully:', result.rows[0]);
            return result.rows[0];
        } catch (error) {
            console.error('Error in createRegistration:', error);
            throw error;
        }
    }

    // get all reg by user id....
    static async getRegistrationsByUserId(userId) {
        const result = await db.query(`
            SELECT r.*, e.title as event_title, e.description, e.date, e.location, e.max_attendees
            FROM registrations r
            JOIN events e ON r.event_id = e.id
            WHERE r.user_id = $1
            ORDER BY r.registration_date DESC
        `, [userId]);
        return result.rows;
    }
}

module.exports = Registration;