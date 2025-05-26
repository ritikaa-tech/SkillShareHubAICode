const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const authMiddleware = require('../middleware/auth');


// ✅ GET all courses
router.get('/', authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// ✅ GET a single course by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// ✅ POST (Create) a new course
router.post('/',authMiddleware, async (req, res) => {
  try {
    console.log("Reached here");
    
    const newCourse = new Course({
      ...req.body,
      instructor: req.user.id, // Automatically set from token
    });
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    
    res.status(400).json({ error: 'Failed to create course', details: err.message });
  }
});

// ✅ PUT (Update) a course by ID
router.put('/:id',authMiddleware, async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCourse) return res.status(404).json({ error: 'Course not found' });
    res.json(updatedCourse);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update course', details: err.message });
  }
});

// ✅ DELETE a course by ID
router.delete('/:id',authMiddleware, async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Add Video
router.put('/:id/videos', authMiddleware, async (req, res) => {
  const course = await Course.findById(req.params.id);
  course.videos.push(req.body);
  await course.save();
  res.json(course);
});

// Add Resource
router.put('/:id/resources',authMiddleware, async (req, res) => {
  const course = await Course.findById(req.params.id);
  course.resources.push(req.body);
  await course.save();
  res.json(course);
});

// Add Quiz
router.put('/:id/quizzes',authMiddleware, async (req, res) => {
  const course = await Course.findById(req.params.id);
  course.quizzes.push(req.body);
  await course.save();
  res.json(course);
});

// Delete Video
router.delete('/:id/videos/:index', authMiddleware, async (req, res) => {
  const course = await Course.findById(req.params.id);
  course.videos.splice(req.params.index, 1);
  await course.save();
  res.json(course);
});

// Delete Resource
router.delete('/:id/resources/:index', authMiddleware, async (req, res) => {
  const course = await Course.findById(req.params.id);
  course.resources.splice(req.params.index, 1);
  await course.save();
  res.json(course);
});

// Delete Quiz
router.delete('/:id/quizzes/:index', authMiddleware, async (req, res) => {
  const course = await Course.findById(req.params.id);
  course.quizzes.splice(req.params.index, 1);
  await course.save();
  res.json(course);
});





module.exports = router;
