const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment.js');
const Course = require('../models/Course.js');
const auth = require('../middleware/auth');

// @route   GET /api/enrollments/mine
// @desc    Get user's enrollments
// @access  Private
router.get('/mine', auth, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate('course', 'title category level content')
      .sort({ enrolledAt: -1 });

    res.json(enrollments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/enrollments/:courseId
// @desc    Enroll in a course
// @access  Private
router.post('/:courseId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.params.courseId
    });

    if (existingEnrollment) {
      return res.status(400).json({ msg: 'Already enrolled in this course' });
    }

    // Create new enrollment
    const enrollment = new Enrollment({
      student: req.user.id,
      course: req.params.courseId,
      status: 'active',
      progress: 0
    });

    await enrollment.save();

    // Add student to course's enrolledStudents array
    course.enrolledStudents.push(req.user.id);
    await course.save();

    res.json(enrollment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/enrollments/:id/progress
// @desc    Update course progress
// @access  Private
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { progress } = req.body;
    if (progress < 0 || progress > 100) {
      return res.status(400).json({ msg: 'Progress must be between 0 and 100' });
    }

    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ msg: 'Enrollment not found' });
    }

    // Check if user is the enrolled student
    if (enrollment.student.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    enrollment.progress = progress;
    enrollment.lastAccessed = Date.now();

    if (progress === 100) {
      enrollment.status = 'completed';
    }

    await enrollment.save();
    res.json(enrollment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 