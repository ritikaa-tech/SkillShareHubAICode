module.exports = {
  port: process.env.PORT || 5002,
  mongoURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || 'https://your-production-domain.com',
  nodeEnv: process.env.NODE_ENV || 'production',
  apiUrl: process.env.API_URL || '/api',
  clientUrl: process.env.CLIENT_URL || 'https://your-production-domain.com',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSize: process.env.MAX_FILE_SIZE || 50 * 1024 * 1024, // 50MB
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['video/mp4', 'application/pdf', 'image/jpeg', 'image/png'],
  sessionSecret: process.env.SESSION_SECRET,
  cookieDomain: process.env.COOKIE_DOMAIN,
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  logLevel: process.env.LOG_LEVEL || 'info',
  rateLimitWindow: process.env.RATE_LIMIT_WINDOW || 15 * 60 * 1000, // 15 minutes
  rateLimitMax: process.env.RATE_LIMIT_MAX || 100
}; 