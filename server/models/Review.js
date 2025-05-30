const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

reviewSchema.index({ userId: 1, courseId: 1 }, { unique: true }); // prevent duplicate reviews

module.exports = mongoose.model('Review', reviewSchema);
