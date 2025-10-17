const User = require('../models/User');
const Registration = require('../models/Registration');

exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.getUserByEmail(email);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json(user);
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({ error: 'Failed to load user' });
    }
};

exports.getUserRegistrations = async (req, res) => {
    try {
        const userId = req.params.id;
        const registrations = await Registration.getUserRegistrations(userId);
        
        res.json(registrations);
    } catch (err) {
        console.error('Error fetching user registrations:', err);
        res.status(500).json({ error: 'Failed to load registrations' });
    }
};