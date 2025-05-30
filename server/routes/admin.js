const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const auth = require('../middleware/auth');
const User = require('../models/User.js');
const Review = require('../models/Review.js');
const Course = require('../models/Course.js');

// Get all users
router.get('/users', auth, isAdmin, async (req, res) => {
  console.log('Admin route - User:', req.user);
  console.log('Admin route - User role:', req.user?.role);
  const users = await User.find({}, '-password');
  res.json(users);
});

// Block or delete a user
router.patch('/users/:id/block', auth, isAdmin, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { blocked: true }, { new: true });
  res.json(user);
});

router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// Moderate reviews
router.delete('/reviews/:id', auth, isAdmin, async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ message: 'Review removed' });
});

// Platform analytics
router.get('/analytics', auth, isAdmin, async (req, res) => {
  console.log('Analytics route - User:', req.user);
  console.log('Analytics route - User role:', req.user?.role);
  const totalUsers = await User.countDocuments();
  const totalCourses = await Course.countDocuments();
  const totalReviews = await Review.countDocuments();
  res.json({ totalUsers, totalCourses, totalReviews });
});

// PATCH block/unblock a user
router.patch('/users/:id/block', auth, isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.json({ message: `${user.name} has been ${user.isBlocked ? 'blocked' : 'unblocked'}` });
});

// DELETE a user
router.delete('/users/:id', auth, isAdmin, async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ message: 'User deleted' });
});

module.exports = router;
