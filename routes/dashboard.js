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

module.exports = router;
