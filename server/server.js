// Load environment variables first
require('dotenv').config();

// Log environment variables (without sensitive data)
console.log('Environment:', process.env.NODE_ENV);
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not Set');
console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not Set');
console.log('Razorpay Key ID:', process.env.RAZORPAY_KEY_ID ? 'Set' : 'Not Set');
console.log('Razorpay Key Secret:', process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Not Set');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const config = require('./config/production');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.razorpay.com", "https://skillsharehubaicodebackend.onrender.com"]
    }
  }
}));
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMax,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://skillsharehubaicodebackend.onrender.com',
      'http://localhost:3000',
      'http://localhost:5002'
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, config.uploadDir)));

// API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/analytics', require('./routes/analytics'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  const status = err.status || 500;
  const message = config.nodeEnv === 'development' ? err.message : 'Internal server error';
  res.status(status).json({ 
    error: message,
    timestamp: new Date().toISOString()
  });
});

// Database connection with retry
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('Failed to connect to MongoDB after multiple attempts');
      process.exit(1);
    }
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = config.port;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`CORS Origin: ${config.corsOrigin}`);
      console.log(`API URL: ${config.apiUrl}`);
      console.log(`Upload Directory: ${config.uploadDir}`);
      console.log(`Rate Limit: ${config.rateLimitMax} requests per ${config.rateLimitWindow/1000/60} minutes`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

