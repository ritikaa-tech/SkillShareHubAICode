const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Course = require('../models/Course');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// Configure multer for video uploads
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/videos';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Configure multer for resource uploads
const resourceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/resources';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only MP4, WebM, and OGG videos are allowed.'));
    }
  }
});

const resourceUpload = multer({
  storage: resourceStorage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Create a new course
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is an instructor or admin
    if (req.user.role !== 'instructor' && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Only instructors and admins can create courses' });
    }

    const course = new Course({
      ...req.body,
      instructor: req.user._id
    });

    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(400).json({ error: error.message });
  }
});

// Upload video
router.post('/upload-video', [auth, isAdmin], videoUpload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    // Here you would typically process the video (e.g., generate thumbnails, get duration)
    // For now, we'll just return the file information
    res.json({
      url: `/uploads/videos/${req.file.filename}`,
      duration: '00:00:00', // You would get this from video processing
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: error.message });
  }
});

// Upload resource
router.post('/upload-resource', [auth, isAdmin], resourceUpload.single('resource'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resource file uploaded' });
    }

    res.json({
      url: `/uploads/resources/${req.file.filename}`,
      filename: req.file.filename,
      type: req.file.mimetype
    });
  } catch (error) {
    console.error('Error uploading resource:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('instructor', 'name email')
      .populate('enrolledStudents', 'name email')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get instructor's courses
router.get('/instructor', auth, async (req, res) => {
  try {
    // Check if user is an instructor
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ error: 'Only instructors can access their courses' });
    }

    const courses = await Course.find({ instructor: req.user._id })
      .populate('enrolledStudents.student', 'name email')
      .sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching instructor courses:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get course enrollments
router.get('/enrollments', auth, async (req, res) => {
  try {
    // Check if user is an instructor
    if (req.user.role !== 'instructor') {
      return res.status(403).json({ error: 'Only instructors can access enrollments' });
    }

    const courses = await Course.find({ instructor: req.user._id })
      .populate('enrolledStudents', 'name email');
    
    const enrollments = courses.flatMap(course => 
      course.enrolledStudents.map(student => ({
        _id: `${course._id}-${student._id}`,
        course: {
          _id: course._id,
          title: course.title
        },
        student: {
          _id: student._id,
          name: student.name
        },
        enrolledAt: new Date(),
        status: 'active'
      }))
    );

    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get instructor earnings
router.get('/earnings', auth, async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id })
      .populate('enrolledStudents.student', 'name email');

    const totalEarnings = courses.reduce((total, course) => {
      return total + (course.price * course.enrolledStudents.length);
    }, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyEarnings = courses.reduce((total, course) => {
      const monthlyEnrollments = course.enrolledStudents.filter(enrollment => {
        const enrollmentDate = new Date(enrollment.enrolledAt);
        return enrollmentDate.getMonth() === currentMonth && 
               enrollmentDate.getFullYear() === currentYear;
      });
      return total + (course.price * monthlyEnrollments.length);
    }, 0);

    const earningsHistory = courses.map(course => ({
      courseId: course._id,
      courseTitle: course.title,
      totalEarnings: course.price * course.enrolledStudents.length,
      enrollments: course.enrolledStudents.length
    }));

    res.json({
      total: totalEarnings,
      monthly: monthlyEarnings,
      history: earningsHistory
    });
  } catch (error) {
    console.error('Error fetching earnings:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email');
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update course
router.put('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if the user is the instructor or an admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }
    
    Object.assign(course, req.body);
    await course.save();
    
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete course
router.delete('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    // Check if the user is the instructor or an admin
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this course' });
    }
    
    await course.remove();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enroll in a course
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if user is already enrolled
    const isEnrolled = course.enrolledStudents.some(
      enrollment => enrollment.student.toString() === req.user._id.toString()
    );

    if (isEnrolled) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Add student to enrolledStudents array with enrollment date
    course.enrolledStudents.push({
      student: req.user._id,
      enrolledAt: new Date()
    });

    await course.save();
    res.json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rate a course
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const courseId = req.params.id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: courseId
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'You must be enrolled in the course to rate it' });
    }

    // Update enrollment with rating and review
    enrollment.rating = rating;
    enrollment.review = review;
    await enrollment.save();

    // Calculate new average rating for the course
    const course = await Course.findById(courseId);
    const enrollments = await Enrollment.find({ course: courseId, rating: { $exists: true } });
    const totalRatings = enrollments.reduce((sum, e) => sum + e.rating, 0);
    course.averageRating = totalRatings / enrollments.length;
    await course.save();

    res.json({ message: 'Rating submitted successfully', enrollment });
  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
