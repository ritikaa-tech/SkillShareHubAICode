module.exports = {
  nodeEnv: process.env.NODE_ENV || 'production',
  port: process.env.PORT || 10000,
  mongoURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || 'https://skillsharehubaicodebackend.onrender.com',
  apiUrl: process.env.API_URL || 'https://skillsharehubaicodebackend.onrender.com/api',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000, // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  clientUrl: process.env.CLIENT_URL || 'https://skillsharehubaicodebackend.onrender.com',
  maxFileSize: process.env.MAX_FILE_SIZE || 50 * 1024 * 1024, // 50MB
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['video/mp4', 'application/pdf', 'image/jpeg', 'image/png'],
  sessionSecret: process.env.SESSION_SECRET,
  cookieDomain: process.env.COOKIE_DOMAIN,
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  logLevel: process.env.LOG_LEVEL || 'info'
}; 