// Verify login....
const requireAuth = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        req.session.errorMessage = 'Please log in to access this page.';
        res.redirect('/login');
    }
};

// Redirect if user is logged in...
const redirectIfAuth = (req, res, next) => {
    if (req.session.userId) {
        res.redirect('/events');
    } else {
        next();
    }
};

module.exports = {
    requireAuth,
    redirectIfAuth
};