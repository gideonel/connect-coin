const { body, param, query } = require('express-validator');

// Common validation rules
const validators = {
  // User validations
  register: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/\d/)
      .withMessage('Password must contain at least one number')
      .matches(/[a-zA-Z]/)
      .withMessage('Password must contain at least one letter'),
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters')
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Name can only contain letters and spaces'),
    body('age')
      .isInt({ min: 18, max: 100 })
      .withMessage('Age must be between 18 and 100'),
    body('gender')
      .isIn(['male', 'female', 'non-binary', 'other'])
      .withMessage('Invalid gender'),
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],

  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('bio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters'),
    body('interests')
      .optional()
      .isArray({ max: 10 })
      .withMessage('Maximum 10 interests allowed'),
    body('interests.*')
      .optional()
      .trim()
      .isLength({ min: 2, max: 30 })
      .withMessage('Each interest must be between 2 and 30 characters'),
  ],

  // Location validations
  location: [
    body('latitude')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Invalid latitude'),
    body('longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Invalid longitude'),
  ],

  // Message validations
  sendMessage: [
    body('content')
      .optional()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Message must be between 1 and 2000 characters'),
    body('type')
      .optional()
      .isIn(['text', 'image', 'gif', 'audio', 'icebreaker'])
      .withMessage('Invalid message type'),
  ],

  // Payment validations
  subscribe: [
    body('plan')
      .isIn(['silver', 'gold', 'platinum'])
      .withMessage('Invalid subscription plan'),
  ],

  purchaseTokens: [
    body('package')
      .isIn(['starter', 'popular', 'best_value'])
      .withMessage('Invalid token package'),
  ],

  // Report validations
  report: [
    body('reason')
      .isIn(['fake', 'inappropriate', 'harassment', 'spam', 'other'])
      .withMessage('Invalid report reason'),
    body('details')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Details cannot exceed 500 characters'),
  ],

  // Common param validations
  mongoId: [
    param('id')
      .isMongoId()
      .withMessage('Invalid ID format'),
  ],

  matchId: [
    param('matchId')
      .isMongoId()
      .withMessage('Invalid match ID'),
  ],

  // Pagination validations
  pagination: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ],

  // Distance/radius validation
  distance: [
    query('distance')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Distance must be between 1 and 100 miles'),
  ],
};

// Custom validation helpers
const isValidAge = (age) => {
  return Number.isInteger(age) && age >= 18 && age <= 100;
};

const isValidCoordinates = (coords) => {
  if (!Array.isArray(coords) || coords.length !== 2) return false;
  const [lng, lat] = coords;
  return lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90;
};

const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

const isValidPhotoUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

module.exports = {
  validators,
  isValidAge,
  isValidCoordinates,
  sanitizeString,
  isValidPhotoUrl,
};
