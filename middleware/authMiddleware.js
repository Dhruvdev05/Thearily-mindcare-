// middleware/authMiddleware.js

// check if logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You must be logged in!');
    res.redirect('/login');
}

// check if student
function isStudent(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'student') {
        return next();
    }
    req.flash('error', 'Only students can access this page');
    res.redirect('/login');
}

// check if therapist
function isTherapist(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'therapist') {
        return next();
    }
    req.flash('error', 'Only therapists can access this page');
    res.redirect('/login');
}


module.exports = { isLoggedIn, isStudent, isTherapist };
