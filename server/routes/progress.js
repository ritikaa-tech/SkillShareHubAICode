const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');

// Get progress for a specific course
router.get('/:courseId', async (req, res) => {
  const userId = req.user?.id || "mock-user-id"; // Mock if auth skipped
  try {
    const progress = await Progress.findOne({ userId, courseId: req.params.courseId });
    res.json(progress || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update lesson completion
router.post('/update', async (req, res) => {
  const { courseId, lessonId } = req.body;
  const userId = req.user?.id || "mock-user-id";

  try {
    let progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      progress = new Progress({ userId, courseId, completedLessons: [lessonId], percentage: 0 });
    } else if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    // Sample progress calculation
    const totalLessons = 10; // replace with real value later
    progress.percentage = Math.floor((progress.completedLessons.length / totalLessons) * 100);
    progress.lastAccessed = new Date();

    await progress.save();
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
