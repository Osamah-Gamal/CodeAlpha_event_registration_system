const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const { connectDB } = require('./config/database');
const expressLayouts = require('express-ejs-layouts');

// import routes...
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const registrationRoutes = require('./routes/registrations');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// session middleware ....
app.use(session({
    secret: 'your-secret-key-here',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // make 24 hour...
}));

// for ejs setup...
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// setting layouts..
app.use(expressLayouts);
app.set('layout', 'layouts/user-layout'); // defualt layout ..
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// view...
app.use((req, res, next) => {
    res.locals.username = req.session.username;
    res.locals.userId = req.session.userId;
    res.locals.role = req.session.role;
    res.locals.isAdmin = req.session.role === 'admin';
    
    // mess.....
    res.locals.successMessage = req.session.successMessage;
    res.locals.errorMessage = req.session.errorMessage;
    
    // values for pages...
    if (!res.locals.pageTitle) res.locals.pageTitle = 'Event Registration System';
    if (!res.locals.currentPage) res.locals.currentPage = '';
    if (!res.locals.pageSubtitle) res.locals.pageSubtitle = '';
    if (!res.locals.stats) res.locals.stats = {};
    if (!res.locals.actionButton) res.locals.actionButton = null;
    
    // delete => messages for success and error 
    if (req.session.successMessage) delete req.session.successMessage;
    if (req.session.errorMessage) delete req.session.errorMessage;
    
    next();
});

// route use....
app.use('/', authRoutes);
app.use('/', eventRoutes);
app.use('/', registrationRoutes);
app.use('/admin', adminRoutes);

// home route...
app.get('/', (req, res) => {
    res.render('index', { 
        pageTitle: 'Home - Event System',
        currentPage: 'home'
    });
});

// API Documentation route....
app.get('/api-docs', (req, res) => {
    res.render('api-docs', {
        pageTitle: 'API Documentation',
        currentPage: 'api-docs'
    });
});

// error handling middleware..
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).render('error', { 
        message: 'Something went wrong!',
        pageTitle: 'Error - Event System'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { 
        message: 'Page not found',
        pageTitle: '404 - Page Not Found'
    });
});


// start server... port => 3000
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Event Registration System running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();