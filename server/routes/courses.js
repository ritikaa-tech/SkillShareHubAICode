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
    res.status(500).json({ error: 'Failed to fetch courses', details: err.message });
  }
});

// ✅ GET a single course by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch course', details: err.message });
  }
});

// ✅ POST (Create) a new course
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newCourse = new Course({
      ...req.body,
      instructor: req.user.id,
    });
    const savedCourse = await newCourse.save();
    res.status(201).json(savedCourse);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create course', details: err.message });
  }
});

// ✅ PUT (Update) a course by ID
router.put('/:id', authMiddleware, async (req, res) => {
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
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course', details: err.message });
  }
});

// ✅ Add Video
router.put('/:id/videos', authMiddleware, async (req, res) => {
  try {
    if (!req.body || !req.body.title || !req.body.url) {
      return res.status(400).json({ error: 'Invalid video data' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    course.videos.push(req.body);
    if (!course.instructor) {
      course.instructor = req.user.id;
    }
    await course.save();
    res.json(course);
  } catch (err) {
    console.error("Error adding video:", err);
    res.status(500).json({ error: 'Failed to add video', details: err.message });
  }
});

// ✅ Add Resource
router.put('/:id/resources', authMiddleware, async (req, res) => {
  try {
    if (!req.body || !req.body.title || !req.body.link) {
      return res.status(400).json({ error: 'Invalid resource data' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    course.resources.push(req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    console.error("Error adding resource:", err);
    res.status(500).json({ error: 'Failed to add resource', details: err.message });
  }
});

// ✅ Add Quiz
router.put('/:id/quizzes', authMiddleware, async (req, res) => {
  try {
    if (!req.body || !req.body.question || !req.body.options || !req.body.answer) {
      return res.status(400).json({ error: 'Invalid quiz data' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    course.quizzes.push(req.body);
    await course.save();
    res.json(course);
  } catch (err) {
    console.error("Error adding quiz:", err);
    res.status(500).json({ error: 'Failed to add quiz', details: err.message });
  }
});

// ✅ Delete Video
router.delete('/:id/videos/:index', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    course.videos.splice(req.params.index, 1);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete video', details: err.message });
  }
});

// ✅ Delete Resource
router.delete('/:id/resources/:index', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    course.resources.splice(req.params.index, 1);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete resource', details: err.message });
  }
});

// ✅ Delete Quiz
router.delete('/:id/quizzes/:index', authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: 'Course not found' });

    course.quizzes.splice(req.params.index, 1);
    await course.save();
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete quiz', details: err.message });
  }
});

module.exports = router;
