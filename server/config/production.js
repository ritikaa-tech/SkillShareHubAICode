module.exports = {
  port: process.env.PORT || 5002,
  mongoURI: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || 'https://your-production-domain.com',
  nodeEnv: 'production',
  logLevel: 'error',
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }
}; 