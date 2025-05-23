const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// GET /api/courses/search?query=...&category=...&priceMin=...&priceMax=...&sort=...
router.get('/search', async (req, res) => {
  const { query, category, priceMin, priceMax, sort } = req.query;

  const filters = {};
  if (query) {
    filters.$or = [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ];
  }
  if (category) filters.category = category;
  if (priceMin || priceMax) {
    filters.price = {};
    if (priceMin) filters.price.$gte = parseFloat(priceMin);
    if (priceMax) filters.price.$lte = parseFloat(priceMax);
  }

  let sortOption = {};
  if (sort === 'price_asc') sortOption.price = 1;
  else if (sort === 'price_desc') sortOption.price = -1;
  else if (sort === 'rating') sortOption.rating = -1;
  else sortOption.createdAt = -1;

  const courses = await Course.find(filters).sort(sortOption).limit(50);
  res.json(courses);
});
