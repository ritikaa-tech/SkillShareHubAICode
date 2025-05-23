require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const skillRoutes = require('./routes/skills');

// Initialize express app
const app = express();
const courseRoutes = require('./routes/courses');
app.use('/api/courses', courseRoutes);

// Middleware
app.use(cors({
  origin: 'http://localhost:3002',
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    name: err.name
  });
  const progressRoutes = require('./routes/progress');
app.use('/api/progress', progressRoutes);
app.use('/api/payment', require('./routes/payment'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));



  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server with port fallback
const startServer = async () => {
  const ports = [5000, 5001, 5002, 5003];
  
  for (const port of ports) {
    try {
      await new Promise((resolve, reject) => {
        const server = app.listen(port, () => {
          console.log(`Server running on port ${port}`);
          resolve();
        });
        
        server.on('error', (error) => {
          if (error.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying next port...`);
            reject(error);
          } else {
            reject(error);
          }
        });
      });
      
      // If we get here, the server started successfully
      break;
    } catch (error) {
      if (error.code !== 'EADDRINUSE') {
        console.error('Server error:', error);
        process.exit(1);
      }
      // If it's EADDRINUSE, continue to next port
    }
  }
};

startServer(); 