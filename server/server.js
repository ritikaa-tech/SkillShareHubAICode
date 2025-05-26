const dotenv = require('dotenv');
dotenv.config();
console.log('PORT from env:', process.env.PORT);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/users');
const coursesRoutes = require('./routes/courses');
const reviewRoutes = require('./routes/reviews');
const authMiddleware = require('./middleware/auth'); // Assuming you have an auth middleware
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin'); // Uncomment if you have admin routes

const app = express();
// Middleware
app.use(cors());
app.use(express.json());


/*app.use((req, res, next) => {
  console.log("➡️  Request received:", req.method, req.path);
  next();
});*/


app.use('/api/payments', paymentRoutes);
// Connect to MongoDB
mongoose.connect('const dotenv = require('dotenv');
dotenv.config();
console.log('PORT from env:', process.env.PORT);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/users');
const coursesRoutes = require('./routes/courses');
const reviewRoutes = require('./routes/reviews');
const authMiddleware = require('./middleware/auth'); // Assuming you have an auth middleware
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin'); // Uncomment if you have admin routes

const app = express();
// Middleware
app.use(cors());
app.use(express.json());


/*app.use((req, res, next) => {
  console.log("➡️  Request received:", req.method, req.path);
  next();
});*/


app.use('/api/payments', paymentRoutes);
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes); // Ensure this is the correct path
app.use('/api/admin', adminRoutes);

console.log(" /api/users route is mounted");

// Start server
const PORT =  process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes); // Ensure this is the correct path
app.use('/api/admin', adminRoutes);

console.log(" /api/users route is mounted");

// Start server
const PORT =  process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

