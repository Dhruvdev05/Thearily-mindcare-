const express = require('express');
const router = express.Router();
const { isStudent, isTherapist } = require('../middleware/authMiddleware');
const Session = require('../models/session');
const User = require('../models/user');

// ===================== STUDENT DASHBOARD =====================
router.get('/student/dashboard', isStudent, async (req, res) => {
    try {
        // Fetch all sessions for this student, populate therapist info
        const sessions = await Session.find({ student: req.user._id })
            .populate('therapist', 'username email')
            .sort({ date: 1 });

        // Optional: Calculate a simple wellness score (for display)
        const wellnessScore = 70 + Math.floor(Math.random() * 20);

        res.render('pages/studentDashboard', {
            user: req.user,
            sessions,
            wellnessScore
        });
    } catch (err) {
        console.error('Error loading student dashboard:', err);
        res.redirect('/');
    }
});

// ===================== THERAPIST DASHBOARD =====================
router.get('/therapist/dashboard', isTherapist, async (req, res) => {
    try {
        // Fetch all sessions assigned to this therapist
        const sessions = await Session.find({ therapist: req.user._id })
            .populate('student', 'username email')
            .sort({ date: 1 });

        // Calculate number of unique active students
        const uniqueStudents = new Set();
        sessions.forEach(session => {
            if (session.student?._id) uniqueStudents.add(session.student._id.toString());
        });

        const activeStudents = uniqueStudents.size;

        // Render dashboard with data
        res.render('pages/therapistDashboard', {
            user: req.user,
            sessions,
            activeStudents
        });
    } catch (err) {
        console.error('Error loading therapist dashboard:', err);
        res.redirect('/');
    }
});


// ===================== STATIC PAGES =====================
router.get('/resources', (req, res) => {
    res.render('pages/resources');
});

router.get('/corporate', (req, res) => {
    res.render('pages/corporate');
});

module.exports = router;
