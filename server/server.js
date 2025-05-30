const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'], // Allow both ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB Connection Error:', err));

// Routes
const courseRoutes = require('./routes/courses');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const courseContentRoutes = require('./routes/courseContent');
const reviewsRoutes = require('./routes/reviews');
const enrollmentsRoutes = require('./routes/enrollments');
const adminRoutes = require('./routes/admin');
const instructorRoutes = require('./routes/instructor');

app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseContentRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/enrollments', enrollmentsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/instructor', instructorRoutes);

// Create temp directory for file exports
const fs = require('fs');
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

