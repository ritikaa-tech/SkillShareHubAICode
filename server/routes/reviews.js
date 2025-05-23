const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Create or update review
router.post('/', async (req, res) => {
  const { userId, courseId, rating, comment } = req.body;

  try {
    const existing = await Review.findOne({ userId, courseId });
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
      return res.json({ message: 'Review updated', review: existing });
    }

    const newReview = new Review({ userId, courseId, rating, comment });
    await newReview.save();
    res.status(201).json({ message: 'Review created', review: newReview });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all reviews for a course
router.get('/:courseId', async (req, res) => {
  try {
    const reviews = await Review.find({ courseId: req.params.courseId }).populate('userId', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
