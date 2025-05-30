// routes/reviews.js
const express = require('express');
const router = express.Router();
const Review = require('../models/Review'); // Your Mongoose model
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

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

// @route   GET /api/reviews/mine
// @desc    Get user's reviews
// @access  Private
router.get('/mine', auth, async (req, res) => {
  try {
    const courses = await Course.find({
      'ratings.user': req.user.id
    }).select('title ratings');

    const reviews = courses.reduce((acc, course) => {
      const userReview = course.ratings.find(rating => rating.user.toString() === req.user.id);
      if (userReview) {
        acc.push({
          _id: userReview._id,
          course: {
            _id: course._id,
            title: course.title
          },
          rating: userReview.rating,
          comment: userReview.review,
          date: userReview.date
        });
      }
      return acc;
    }, []);

    res.json(reviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findOne({
      'ratings._id': req.params.id
    });

    if (!course) {
      return res.status(404).json({ msg: 'Review not found' });
    }

    // Check if user is the review author
    const review = course.ratings.find(rating => rating._id.toString() === req.params.id);
    if (!review || review.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Remove the review
    course.ratings = course.ratings.filter(rating => rating._id.toString() !== req.params.id);

    // Recalculate average rating
    if (course.ratings.length > 0) {
      course.averageRating = course.ratings.reduce((acc, item) => acc + item.rating, 0) / course.ratings.length;
    } else {
      course.averageRating = 0;
    }

    await course.save();
    res.json({ msg: 'Review removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
