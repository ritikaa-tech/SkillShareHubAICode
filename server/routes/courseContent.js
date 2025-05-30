const express = require('express');
const router = express.Router();
const Course = require('../models/Course.js');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   POST /api/courses/:courseId/content
// @desc    Add content to a course
// @access  Private (Instructor only)
router.post(
  '/:courseId/content',
  [
    auth,
    [
      check('type', 'Content type is required').isIn(['video', 'pdf', 'quiz']),
      check('title', 'Title is required').not().isEmpty(),
      check('url', 'URL is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const course = await Course.findById(req.params.courseId);
      
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }

      // Check if user is the course instructor
      if (course.instructor.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const { type, title, url, description } = req.body;

      course.content.push({
        type,
        title,
        url,
        description
      });

      await course.save();
      res.json(course);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT /api/courses/:courseId/content/:contentId
// @desc    Update course content
// @access  Private (Instructor only)
router.put(
  '/:courseId/content/:contentId',
  [
    auth,
    [
      check('type', 'Content type is required').isIn(['video', 'pdf', 'quiz']),
      check('title', 'Title is required').not().isEmpty(),
      check('url', 'URL is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const course = await Course.findById(req.params.courseId);
      
      if (!course) {
        return res.status(404).json({ msg: 'Course not found' });
      }

      // Check if user is the course instructor
      if (course.instructor.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }

      const content = course.content.id(req.params.contentId);
      if (!content) {
        return res.status(404).json({ msg: 'Content not found' });
      }

      const { type, title, url, description } = req.body;

      content.type = type;
      content.title = title;
      content.url = url;
      content.description = description;

      await course.save();
      res.json(course);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE /api/courses/:courseId/content/:contentId
// @desc    Delete course content
// @access  Private (Instructor only)
router.delete('/:courseId/content/:contentId', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if user is the course instructor
    if (course.instructor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Find the content by its _id
    const contentIndex = course.content.findIndex(
      content => content._id.toString() === req.params.contentId
    );

    if (contentIndex === -1) {
      return res.status(404).json({ msg: 'Content not found' });
    }

    // Remove the content
    course.content.splice(contentIndex, 1);
    await course.save();
    
    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 