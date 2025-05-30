const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [String], // store lesson IDs or titles
  percentage: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Progress', progressSchema);
