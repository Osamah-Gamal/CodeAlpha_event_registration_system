const db = require('../config/database');

class Event {
    // get all events...
    static async getAllEvents() {
        try {
            console.log('Fetching all events from database...');
            
            // display all events...
            const result = await db.query(`
                SELECT * FROM events 
                ORDER BY date ASC
            `);
            
            console.log(`Found ${result.rows.length} events`);
            return result.rows;
        } catch (error) {
            console.error('Error in getAllEvents:', error);
            throw error;
        }
    }
    // get/:id
    static async getEventById(id) {
        try {
            console.log('Fetching event by ID:', id);
            const result = await db.query('SELECT * FROM events WHERE id = $1', [id]);
            console.log('Event query result:', result.rows[0] ? 'Found' : 'Not found');
            return result.rows[0];
        } catch (error) {
            console.error('Error in getEventById:', error);
            throw error;
        }
    }

    // Additional method for API usage
    static async getEventsWithPagination(page = 1, limit = 10) {
        try {
            const offset = (page - 1) * limit;
            const result = await db.query(`
                SELECT * FROM events 
                ORDER BY date ASC 
                LIMIT $1 OFFSET $2
            `, [limit, offset]);
            
            const countResult = await db.query('SELECT COUNT(*) FROM events');
            const total = parseInt(countResult.rows[0].count);
            
            return {
                events: result.rows,
                pagination: {
                    page,
                    limit,
                    total,
                    pages: Math.ceil(total / limit)
                }
            };
        } catch (error) {
            console.error('Error in getEventsWithPagination:', error);
            throw error;
        }
    }
    
}

module.exports = Event;