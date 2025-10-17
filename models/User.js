const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
    // create a ne account....
    static async createUser(username, email, password, role = 'user') {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const result = await db.query(
            'INSERT INTO users (username, email, password, role, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [username, email, hashedPassword, role, new Date()]
        );
        return result.rows[0];
    }

    // find user by email...
    static async findByEmail(email) {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0];
    }

    // find user by Username...
    static async findByUsername(username) {
        const result = await db.query(
            'SELECT * FROM users WHERE username = $1',
            [username]
        );
        return result.rows[0];
    }

    // find user by id...
    static async findById(id) {
        const result = await db.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0];
    }

    // get all users...
    static async getAllUsers() {
        const result = await db.query(
            'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        return result.rows;
    }

    // update user Role...
    static async updateUserRole(userId, role) {
        const result = await db.query(
            'UPDATE users SET role = $1 WHERE id = $2 RETURNING *',
            [role, userId]
        );
        return result.rows[0];
    }

    // delet user....
    static async deleteUser(userId) {
        try {
            // is default...
            const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
            if (user.rows.length > 0 && user.rows[0].username === 'admin') {
                throw new Error('Cannot delete the system admin.');
            }

            // delete the link...
            await db.query('DELETE FROM registrations WHERE user_id = $1', [userId]);
            
            // delete user...
            const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    // virify passord...
    static async verifyPassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    // has any admin ...
    static async hasAnyAdmin() {
        const result = await db.query(
            'SELECT COUNT(*) FROM users WHERE role = $1',
            ['admin']
        );
        return parseInt(result.rows[0].count) > 0;
    }
}

module.exports = User;