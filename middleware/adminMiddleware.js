// Verify that the user is an admin...
function requireAdmin(req, res, next) {
    if (req.session.role === 'admin') {
        next();
    } else {
        req.session.errorMessage = 'Access denied: Admins only';
        res.redirect('/');
    }
}

// Check if the user is an admin or the user himself...
exports.requireAdminOrSelf = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    
    const requestedUserId = parseInt(req.params.userId);
    if (req.session.role !== 'admin' && req.session.userId !== requestedUserId) {
        return res.render('error', { 
            message: 'Access denied.'
        });
    }
    next();
};
module.exports = {
    requireAdmin
    
};