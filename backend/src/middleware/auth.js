const jwt = require('jsonwebtoken');
const UserModel = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Please authenticate. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_super_secret_key_change_me_in_production');
    
    // Find user
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User session not found or expired.' });
    }

    // Attach user information to request
    req.user = {
      id: user.id || user._id.toString(),
      email: user.email
    };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate. Invalid or expired token.' });
  }
};

module.exports = auth;
