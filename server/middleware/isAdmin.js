module.exports = function (req, res, next) {
    console.log('isAdmin middleware - Checking user:', req.user ? {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role
    } : 'No user found');

    if (!req.user) {
      console.log('isAdmin middleware - No user found in request');
      return res.status(403).json({ error: 'Admin access only' });
    }

    if (req.user.role !== 'admin') {
      console.log('isAdmin middleware - User is not admin. Role:', req.user.role);
      return res.status(403).json({ error: 'Admin access only' });
    }

    console.log('isAdmin middleware - User is admin, proceeding');
    next();
};
  