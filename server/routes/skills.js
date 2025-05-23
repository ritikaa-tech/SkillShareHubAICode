const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// @route   GET api/skills
// @desc    Get all skills
// @access  Public
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('username skills');
    const skills = users.reduce((acc, user) => {
      if (user.skills && user.skills.length > 0) {
        acc.push(...user.skills);
      }
      return acc;
    }, []);
    res.json(skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST api/skills
// @desc    Add a skill to user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    body('name').trim().notEmpty(),
    body('level').isIn(['beginner', 'intermediate', 'advanced']),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, level } = req.body;

    try {
      const user = await User.findById(req.user._id);
      const newSkill = { name, level };

      // Check if skill already exists
      const skillExists = user.skills.some(
        skill => skill.name.toLowerCase() === name.toLowerCase()
      );

      if (skillExists) {
        return res.status(400).json({ message: 'Skill already exists' });
      }

      user.skills.push(newSkill);
      await user.save();

      res.json(user.skills);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// @route   DELETE api/skills/:skillId
// @desc    Remove a skill from user profile
// @access  Private
router.delete('/:skillId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.skills = user.skills.filter(
      skill => skill._id.toString() !== req.params.skillId
    );
    await user.save();
    res.json(user.skills);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 