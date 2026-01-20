const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { protect, optionalAuth } = require('../middleware/auth');

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -blocked -reported');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, [
  body('name').optional().trim().isLength({ min: 2, max: 50 }),
  body('bio').optional().isLength({ max: 500 }),
  body('interests').optional().isArray({ max: 10 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const allowedFields = ['name', 'bio', 'interests', 'lookingFor', 'settings'];
    const updates = {};
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (for viewing profiles)
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('name age gender bio photos interests location verified isOnline lastActive');

    if (!user || user.status !== 'active') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if blocked
    if (user.blocked.includes(req.user._id) || req.user.blocked.includes(user._id)) {
      return res.status(403).json({ success: false, message: 'Cannot view this profile' });
    }

    // Increment profile views
    await User.findByIdAndUpdate(req.params.id, { $inc: { 'stats.profileViews': 1 } });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
});

// @route   POST /api/users/block/:id
// @desc    Block a user
// @access  Private
router.post('/block/:id', protect, async (req, res) => {
  try {
    const userToBlock = await User.findById(req.params.id);
    if (!userToBlock) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.user.blocked.includes(req.params.id)) {
      return res.status(400).json({ success: false, message: 'User already blocked' });
    }

    req.user.blocked.push(req.params.id);
    await req.user.save();

    // TODO: Unmatch if matched

    res.json({ success: true, message: 'User blocked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to block user' });
  }
});

// @route   DELETE /api/users/block/:id
// @desc    Unblock a user
// @access  Private
router.delete('/block/:id', protect, async (req, res) => {
  try {
    req.user.blocked = req.user.blocked.filter(id => id.toString() !== req.params.id);
    await req.user.save();

    res.json({ success: true, message: 'User unblocked successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to unblock user' });
  }
});

// @route   POST /api/users/report/:id
// @desc    Report a user
// @access  Private
router.post('/report/:id', protect, [
  body('reason').isIn(['fake', 'inappropriate', 'harassment', 'spam', 'other']),
  body('details').optional().isLength({ max: 500 }),
], async (req, res) => {
  try {
    const { reason, details } = req.body;
    
    // TODO: Create report in database and notify admins
    
    req.user.reported.push(req.params.id);
    await req.user.save();

    res.json({ success: true, message: 'Report submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit report' });
  }
});

// @route   PUT /api/users/location
// @desc    Update user location
// @access  Private
router.put('/location', protect, [
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
], async (req, res) => {
  try {
    const { latitude, longitude, city, country } = req.body;

    req.user.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
      city,
      country,
      lastUpdated: new Date(),
    };
    await req.user.save();

    res.json({ success: true, message: 'Location updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update location' });
  }
});

// @route   GET /api/users/likes
// @desc    Get users who liked current user (premium feature)
// @access  Private (Premium)
router.get('/likes', protect, async (req, res) => {
  try {
    if (!req.user.premium.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription required',
        upgrade: true,
      });
    }

    // TODO: Get likes from Swipe collection
    const likes = [];

    res.json({ success: true, likes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch likes' });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', protect, async (req, res) => {
  try {
    // Soft delete - just mark as deleted
    req.user.status = 'deleted';
    req.user.email = `deleted_${Date.now()}_${req.user.email}`;
    await req.user.save();

    // TODO: Cancel any active subscriptions
    // TODO: Delete photos from Cloudinary
    // TODO: Anonymize messages

    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete account' });
  }
});

module.exports = router;
