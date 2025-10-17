const User = require('../models/User');

// Display the registration page....
exports.showRegister = (req, res) => {
    res.render('register', { 
        error: null
    });
};

// Process account creation...
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Verify data...
        if (!username || !email || !password) {
            return res.render('register', { 
                error: 'All fields are required'
            });
        }

        // Check if the user already exists...
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.render('register', { 
                error:'Email is already registered'
            });
        }

        const existingUsername = await User.findByUsername(username);
        if (existingUsername) {
            return res.render('register', { 
                error: 'Username already registered'
            });
        }

        // Create the user as a normal user (not admin)...
        const user = await User.createUser(username, email, password, 'user');

        // Save user data in the session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.role = user.role;

        res.redirect('/events');
    } catch (error) {
        console.error('Error in registration:', error);
        res.render('register', { 
            error:'An error occurred while creating the account'
        });
    }
};

// Display the login page...
exports.showLogin = (req, res) => {
    res.render('login', { 
        error: null
    });
};

// Login processing...
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.render('login', { 
                error: 'Email and password required'
            });
        }

        //  Find the user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.render('login', { 
                error: 'Incorrect email or password'
            });
        }

       // Verify password using bcrypt
        const isValidPassword = await User.verifyPassword(password, user.password);
        if (!isValidPassword) {
            return res.render('login', { 
                error: 'Incorrect email or password'
            });
        }

        //  Save user data in the session
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.role = user.role;

        console.log(`User logged in: ${user.username} (${user.role})`);

        // Redirect admin to control panel
        if (user.role === 'admin') {
            return res.redirect('/admin/dashboard');
        }

        res.redirect('/events');
    } catch (error) {
        console.error('Error in login:', error);
        res.render('login', { 
            error: 'An error occurred while logging in'
        });
    }
};



//Log out...
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/');
    });
};