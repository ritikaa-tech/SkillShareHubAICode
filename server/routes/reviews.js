// routes/reviews.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); // Your Mongoose model

router.post('/', async (req, res) => {
  const { userId, courseId, rating, comment } = req.body;

  if (!userId || !courseId || !rating) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const review = new Review({ userId, courseId, rating, comment });
    await review.save();
    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (err) {
    console.error('Review submission error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
