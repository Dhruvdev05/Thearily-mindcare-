const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get('/register', (req,res) => {
    res.render("pages/register")
});

// POST: Register
router.post('/register', async (req, res, next) => {
    try {
        const { username, email, password, role } = req.body;
        const newUser = new User({ username, email, role });
        const registeredUser = await User.register(newUser, password);

        // Auto-login after register
        req.login(registeredUser, (err) => {
            if (err) return next(err);

            if (role === 'student') {
                // 👉 First go to problem form
                return res.redirect('/student/problem-form');
            }

            if (role === 'therapist') {
                return res.redirect('/therapist/dashboard');
            }

            res.redirect('/');
        });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
});


// GET: Login page
router.get('/login', (req, res) => {
    res.render('pages/login');
});

// POST: Login
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
   console.log("✅ Logged in user:", req.user);  // whole user object
    console.log("👉 Username:", req.user.username);  
    console.log("👉 Role:", req.user.role);


    if (req.user.role === 'student') {
        return res.redirect('/student/dashboard');
        
    }
    if (req.user.role === 'therapist') {
        return res.redirect('/therapist/dashboard');
    }
   
});

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        res.redirect('/');
    });
});


module.exports = router;