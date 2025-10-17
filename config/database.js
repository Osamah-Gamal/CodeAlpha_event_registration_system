const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

// PostgreSQL connection settings.....
const pool = new Pool({
    user: 'postgres',
    password: 'osamah777',
    host: 'localhost',
    port: 5432,
    database: 'EventRegistrationDB'
});

// Default admin creation function...
const createDefaultAdmin = async () => {
    try {
        const hasAdmin = await pool.query(
            'SELECT COUNT(*) FROM users WHERE role = $1',
            ['admin']
        );

        if (parseInt(hasAdmin.rows[0].count) === 0) {
            const hashedPassword = await bcrypt.hash('osamah123', 10);
            
            await pool.query(`
                INSERT INTO users (username, email, password, role) 
                VALUES ($1, $2, $3, $4)
            `, ['osamah', 'osamah@events.com', hashedPassword, 'admin']);
            
            
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error('Error creating default admin:', err);
    }
};

//Database connection function...
const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL database');
        await createTables();
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

// Create tables...
const createTables = async () => {
    try {
        // Users table...
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'user',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created/verified');

       // Event table...
        await pool.query(`
            CREATE TABLE IF NOT EXISTS events (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                date DATE NOT NULL,
                location VARCHAR(255),
                max_attendees INTEGER,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Events table created/verified');

       // Recording table....
        await pool.query(`
            CREATE TABLE IF NOT EXISTS registrations (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
                registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, event_id)
            )
        `);
        console.log('Registrations table created/verified');

       // Create default admin....
        await createDefaultAdmin();

       
    } catch (err) {
        console.error('Error creating tables:', err);
    }
};



module.exports = {
    query: (text, params) => pool.query(text, params),
    connectDB
};