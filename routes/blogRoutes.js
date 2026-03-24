const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const User = require('../models/user');
const { isTherapist } = require('../middleware/authMiddleware');

// GET: All blogs (public)
router.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'username').sort({ createdAt: -1 });
        res.render('pages/blogs', { blogs, user: req.user });
    } catch (err) {
        console.error(err);
        res.redirect('/');
    }
});

// GET: New blog form (Therapists only)
router.get('/therapist/new-blog', isTherapist, (req, res) => {
    res.render('pages/newBlog', { user: req.user });
});

// POST: Create new blog
router.post('/therapist/new-blog', isTherapist, async (req, res) => {
    try {
        const { title, content } = req.body;
        const blog = new Blog({
            title,
            content,
            author: req.user._id
        });
        await blog.save();

        // 🎁 Update wallet info
        req.user.wallet.blogsWritten += 1;
        req.user.wallet.rewardPoints += 10;

        // Badge logic
        const blogs = req.user.wallet.blogsWritten;
        if (blogs >= 10) req.user.wallet.badge = 'Gold';
        else if (blogs >= 5) req.user.wallet.badge = 'Silver';
        else req.user.wallet.badge = 'Bronze';

        await req.user.save();

        req.flash('success', 'Blog published successfully! You earned 10 points 🎉');
        res.redirect('/blogs');
    } catch (err) {
        console.error('Error publishing blog:', err);
        req.flash('error', 'Error publishing blog.');
        res.redirect('/therapist/new-blog');
    }
});

module.exports = router;
