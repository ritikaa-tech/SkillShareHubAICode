const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

// Helper function to get analytics data
const getAnalyticsData = async (userId, role) => {
  let courses;
  if (role === 'admin') {
    // Admin can see all courses
    courses = await Course.find();
  } else if (role === 'instructor') {
    // Instructor can only see their courses
    courses = await Course.find({ instructor: userId });
  } else {
    // Regular users can only see their enrolled courses
    const enrollments = await Enrollment.find({ student: userId }).populate('course');
    courses = enrollments.map(e => e.course);
  }

  const courseIds = courses.map(course => course._id);

  // Get all enrollments for the courses
  const enrollments = await Enrollment.find({ course: { $in: courseIds } })
    .populate('student', 'name email')
    .populate('course', 'title');

  // Calculate total students
  const totalStudents = new Set(enrollments.map(e => e.student._id.toString())).size;

  // Calculate average rating
  const ratings = enrollments.filter(e => e.rating).map(e => e.rating);
  const averageRating = ratings.length > 0
    ? ratings.reduce((a, b) => a + b, 0) / ratings.length
    : 0;

  // Calculate completion rate
  const completedEnrollments = enrollments.filter(e => e.progress === 100).length;
  const completionRate = enrollments.length > 0
    ? (completedEnrollments / enrollments.length) * 100
    : 0;

  // Calculate revenue by course
  const revenueByCourse = courses.map(course => {
    const courseEnrollments = enrollments.filter(e => e.course._id.toString() === course._id.toString());
    const courseRatings = courseEnrollments.filter(e => e.rating).map(e => e.rating);
    const averageCourseRating = courseRatings.length > 0
      ? courseRatings.reduce((a, b) => a + b, 0) / courseRatings.length
      : 0;

    return {
      _id: course._id,
      title: course.title,
      enrollments: courseEnrollments.length,
      revenue: course.price * courseEnrollments.length,
      rating: averageCourseRating
    };
  });

  // Get student progress
  const studentProgress = enrollments.map(enrollment => ({
    _id: enrollment._id,
    student: {
      _id: enrollment.student._id,
      name: enrollment.student.name
    },
    course: {
      _id: enrollment.course._id,
      title: enrollment.course.title
    },
    percentage: enrollment.progress,
    lastActivity: enrollment.lastAccessed || enrollment.enrolledAt
  }));

  return {
    totalStudents,
    averageRating,
    completionRate,
    revenueByCourse,
    studentProgress
  };
};

// @route   GET /api/analytics
// @desc    Get analytics data based on user role
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let courses;
    if (req.user.role === 'admin') {
      courses = await Course.find();
    } else if (req.user.role === 'instructor') {
      courses = await Course.find({ instructor: req.user._id });
    } else {
      courses = await Course.find({ 'enrolledStudents.student': req.user._id });
    }

    const analytics = await Promise.all(courses.map(async (course) => {
      const totalStudents = course.enrolledStudents.length;
      const totalRatings = course.enrolledStudents.reduce((sum, enrollment) => sum + (enrollment.rating || 0), 0);
      const averageRating = totalStudents > 0 ? totalRatings / totalStudents : 0;
      const completedStudents = course.enrolledStudents.filter(e => e.progress === 100).length;
      const completionRate = totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0;
      const revenue = course.price * totalStudents;

      return {
        courseId: course._id,
        courseTitle: course.title,
        totalStudents,
        averageRating,
        completionRate,
        revenue,
        studentProgress: course.enrolledStudents.map(enrollment => ({
          studentId: enrollment.student,
          progress: enrollment.progress || 0,
          rating: enrollment.rating || 0
        }))
      };
    }));

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/analytics/export
// @desc    Export analytics data as CSV
// @access  Private (Admin and Instructor only)
router.get('/export', auth, async (req, res) => {
  try {
    // Only admin and instructor can export analytics
    if (!['admin', 'instructor'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Only admins and instructors can export analytics' });
    }

    const analyticsData = await getAnalyticsData(req.user._id, req.user.role);
    const { studentProgress } = analyticsData;

    const csvWriter = createObjectCsvWriter({
      path: path.join(__dirname, '../temp/analytics.csv'),
      header: [
        { id: 'courseTitle', title: 'Course Title' },
        { id: 'studentName', title: 'Student Name' },
        { id: 'studentEmail', title: 'Student Email' },
        { id: 'progress', title: 'Progress (%)' },
        { id: 'rating', title: 'Rating' },
        { id: 'enrollmentDate', title: 'Enrollment Date' },
        { id: 'lastActivity', title: 'Last Activity' }
      ]
    });

    const records = studentProgress.map(progress => ({
      courseTitle: progress.course.title,
      studentName: progress.student.name,
      studentEmail: progress.student.email,
      progress: progress.percentage,
      rating: progress.rating || 'Not rated',
      enrollmentDate: progress.lastActivity.toISOString().split('T')[0],
      lastActivity: progress.lastActivity.toISOString().split('T')[0]
    }));

    await csvWriter.writeRecords(records);

    res.download(path.join(__dirname, '../temp/analytics.csv'), 'course-analytics.csv', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Error downloading file' });
      }
    });
  } catch (err) {
    console.error('Error exporting analytics:', err);
    res.status(500).json({ error: 'Failed to export analytics data' });
  }
});

module.exports = router; 