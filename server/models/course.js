const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String },
  price: { type: Number, default: 0 },
  tags: [String],
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnail: { type: String }, // URL to thumbnail or Cloudinary
  videos: [{ title: String, url: String }],
  resources: [{ name: String, link: String }],
  quizzes: [{ question: String, options: [String], answer: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Course', courseSchema);
