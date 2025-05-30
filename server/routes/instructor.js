const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Course = require('../models/Course.js');
const Enrollment = require('../models/Enrollment.js');
const User = require('../models/User.js');

// Get instructor dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    // Get instructor's courses
    const courses = await Course.find({ instructor: req.user._id });
    
    // Get total enrollments for instructor's courses
    const enrollments = await Enrollment.find({
      course: { $in: courses.map(course => course._id) }
    });

    // Get total students (unique)
    const uniqueStudents = new Set(enrollments.map(e => e.student.toString())).size;

    // Get total revenue
    const revenue = enrollments.reduce((total, enrollment) => {
      const course = courses.find(c => c._id.toString() === enrollment.course.toString());
      return total + (course ? course.price : 0);
    }, 0);

    res.json({
      courses: courses.length,
      totalEnrollments: enrollments.length,
      totalStudents: uniqueStudents,
      totalRevenue: revenue,
      coursesList: courses
    });
  } catch (error) {
    console.error('Error fetching instructor dashboard data:', error);
    res.status(500).json({ message: 'Error fetching instructor dashboard data' });
  }
});

// Get instructor's courses
router.get('/courses', auth, async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    res.status(500).json({ message: 'Error fetching instructor courses' });
  }
});

// Get course analytics
router.get('/courses/:courseId/analytics', auth, async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.courseId,
      instructor: req.user._id
    });

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const enrollments = await Enrollment.find({ course: course._id })
      .populate('student', 'name email');

    const analytics = {
      totalEnrollments: enrollments.length,
      averageRating: course.rating || 0,
      totalRevenue: enrollments.length * course.price,
      students: enrollments.map(e => ({
        student: e.student,
        enrolledAt: e.enrolledAt,
        progress: e.progress,
        status: e.status
      }))
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching course analytics:', error);
    res.status(500).json({ message: 'Error fetching course analytics' });
  }
});

module.exports = router; 