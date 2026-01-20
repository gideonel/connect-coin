const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - require authentication
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found',
        });
      }

      if (user.status === 'banned') {
        return res.status(403).json({
          success: false,
          message: 'Account has been suspended',
          reason: user.banReason,
        });
      }

      if (user.status === 'deleted') {
        return res.status(401).json({
          success: false,
          message: 'Account has been deleted',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired',
          expired: true,
        });
      }
      
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

// Optional auth - attach user if token present, but don't require it
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (user && user.status === 'active') {
          req.user = user;
        }
      } catch (error) {
        // Token invalid, continue without user
      }
    }

    next();
  } catch (error) {
    next();
  }
};

// Check if user has premium subscription
const requirePremium = (req, res, next) => {
  if (!req.user.premium.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Premium subscription required',
      upgrade: true,
    });
  }
  next();
};

// Check premium tier
const requirePremiumTier = (tiers) => {
  return (req, res, next) => {
    if (!req.user.premium.isActive || !tiers.includes(req.user.premium.plan)) {
      return res.status(403).json({
        success: false,
        message: `${tiers.join(' or ')} subscription required`,
        upgrade: true,
        requiredTiers: tiers,
      });
    }
    next();
  };
};

// Admin only routes
const requireAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    });
  }
  next();
};

module.exports = {
  protect,
  optionalAuth,
  requirePremium,
  requirePremiumTier,
  requireAdmin,
};
