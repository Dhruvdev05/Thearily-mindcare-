const express = require('express');
const router = express.Router();
const Session = require('../models/session');
const { isStudent, isTherapist } = require('../middleware/authMiddleware');

// ================== STUDENT ==================
// GET: Book session form
const User = require('../models/user');

// GET: Book session form
router.get('/student/book-session', isStudent, async (req, res) => {
    try {
        const therapists = await User.find({ role: 'therapist' }); // fetch all therapists
        res.render('pages/bookSession', { user: req.user, therapists });
    } catch (err) {
        console.error(err);
        res.send('Error loading therapists');
    }
});


// POST: Book session
router.post('/student/book-session', isStudent, async (req, res) => {
    try {
        const { date, time, notes } = req.body;

        const newSession = new Session({
            student: req.user._id,
            date,
            time,
            notes
        });

        await newSession.save();
        req.flash('success', 'Session booked successfully!');
        res.redirect('/student/dashboard');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error booking session.');
        res.redirect('/student/book-session');
    }
});

// ================== THERAPIST ==================
// GET: Manage sessions
router.get('/therapist/manage-sessions', isTherapist, async (req, res) => {
    try {
        const sessions = await Session.find()
            .populate('student', 'username email')
            .sort({ date: 1 });

        res.render('pages/manageSession.ejs', { user: req.user, sessions });
    } catch (err) {
        console.error(err);
        res.send('Error loading sessions');
    }
});

// POST: Approve session
router.post('/therapist/session/:id/approve', isTherapist, async (req, res) => {
    await Session.findByIdAndUpdate(req.params.id, {
        status: 'approved',
        therapist: req.user._id
    });
    res.redirect('/therapist/manage-sessions');
});

// POST: Reject session
router.post('/therapist/session/:id/reject', isTherapist, async (req, res) => {
    await Session.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.redirect('/therapist/manage-sessions');
});

module.exports = router;
