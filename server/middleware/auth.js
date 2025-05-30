const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth middleware - Token received:', token);
    
    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Decoded token:', decoded);
    
    const user = await User.findById(decoded.userId);
    console.log('Auth middleware - Found user:', user ? {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    } : 'No user found');

    if (!user) {
      console.log('Auth middleware - User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    req.token = token;
    console.log('Auth middleware - User authenticated:', {
      id: user._id,
      name: user.name,
      role: user.role
    });
    next();
  } catch (error) {
    console.log('Auth middleware - Authentication error:', error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = auth; 