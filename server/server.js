const dotenv = require('dotenv');
dotenv.config();


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
app.use(cors({
  origin: 'https://skillsharehub-526z.onrender.com', // your frontend URL
  credentials: true,
}));

app.use(express.json());


/*app.use((req, res, next) => {
  console.log("➡️  Request received:", req.method, req.path);
  next();
});*/
// Routes
app.use('/api/users', userRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/payment', paymentRoutes); // Ensure this is the correct path
app.use('/api/admin', adminRoutes);



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
app.get('/display', (req, res) => {
  res.send('Display route is working!');
});


// Start server
const PORT =  process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

