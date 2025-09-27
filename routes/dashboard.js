const express = require('express');
const router = express.Router();
const { isStudent, isTherapist } = require('../middleware/authMiddleware');

// Student Dashboard
router.get('/student/dashboard', isStudent, (req, res) => {
    res.render('pages/studentDashboard', { user: req.user });
});

// Therapist Dashboard
router.get('/therapist/dashboard', isTherapist, (req, res) => {
    res.render('pages/therapistDashboard', { user: req.user });
});

// GET: Wellness Resources
router.get('/resources', (req, res) => {
    res.render('pages/resources'); // no DB, just static EJS
});

// Corporate Page
router.get('/corporate', (req, res) => {
    res.render('pages/corporate');
});


module.exports = router;
