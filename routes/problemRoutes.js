const express = require('express');
const router = express.Router();
const { isStudent } = require('../middleware/authMiddleware');
const Problem = require('../models/problem');

// GET: Show form
router.get('/student/problem-form', isStudent, async (req, res) => {
  const existing = await Problem.findOne({ student: req.user._id });
  if (existing) {
    // Already filled → redirect to dashboard
    return res.redirect('/student/dashboard');
  }
  res.render('pages/problemForm', { user: req.user });
});

// POST: Save form
router.post('/student/problem-form', isStudent, async (req, res) => {
  try {
    const { issues, description } = req.body;

    await Problem.create({
      student: req.user._id,
      issues: Array.isArray(issues) ? issues.slice(0, 3) : [issues],
      description
    });

    req.flash('success', 'Your issues have been recorded!');
    res.redirect('/student/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error submitting form.');
    res.redirect('/student/problem-form');
  }
});

module.exports = router;
