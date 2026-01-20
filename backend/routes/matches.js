const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { Swipe } = require('../models/Match');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/matches
// @desc    Get all matches for current user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const matches = await Match.getUserMatches(req.user._id, { page, limit });

    // Format matches to show the other user
    const formattedMatches = matches.map(match => {
      const otherUser = match.users.find(u => u._id.toString() !== req.user._id.toString());
      return {
        id: match._id,
        user: otherUser,
        compatibility: match.compatibility,
        type: match.type,
        messageCount: match.messageCount,
        lastInteraction: match.lastInteraction,
        createdAt: match.createdAt,
      };
    });

    res.json({ success: true, matches: formattedMatches });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch matches' });
  }
});

// @route   GET /api/matches/discover
// @desc    Get profiles to swipe on
// @access  Private
router.get('/discover', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const user = req.user;

    // Get IDs of users already swiped on
    const swipedUsers = await Swipe.find({ from: user._id }).select('to');
    const swipedIds = swipedUsers.map(s => s.to);

    // Build query based on user preferences
    const query = {
      _id: { $nin: [...swipedIds, user._id, ...user.blocked] },
      status: 'active',
      age: {
        $gte: user.lookingFor.ageRange.min,
        $lte: user.lookingFor.ageRange.max,
      },
    };

    // Gender filter
    if (user.lookingFor.gender && !user.lookingFor.gender.includes('all')) {
      query.gender = { $in: user.lookingFor.gender };
    }

    // Location filter (if user has location set)
    if (user.location?.coordinates && user.lookingFor.distance) {
      query['location.coordinates'] = {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: user.location.coordinates,
          },
          $maxDistance: user.lookingFor.distance * 1609.34, // Convert miles to meters
        },
      };
    }

    const profiles = await User.find(query)
      .select('name age gender bio photos interests location verified isOnline lastActive')
      .skip((page - 1) * limit)
      .limit(limit);

    // Calculate compatibility for each profile
    const profilesWithCompatibility = profiles.map(profile => ({
      ...profile.toObject(),
      compatibility: calculateCompatibility(user, profile),
    }));

    res.json({ success: true, profiles: profilesWithCompatibility });
  } catch (error) {
    console.error('Discover error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profiles' });
  }
});

// @route   POST /api/matches/swipe
// @desc    Swipe on a user (like/dislike/superlike)
// @access  Private
router.post('/swipe', protect, async (req, res) => {
  try {
    const { userId, action } = req.body;

    if (!['like', 'dislike', 'superlike'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser || targetUser.status !== 'active') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check daily limits for non-premium users
    if (!req.user.premium.isActive) {
      // TODO: Implement daily limit checking
    }

    // Check if superlike and user has enough
    if (action === 'superlike') {
      // TODO: Check superlike availability
    }

    // Create swipe record
    await Swipe.findOneAndUpdate(
      { from: req.user._id, to: userId },
      { action, createdAt: new Date() },
      { upsert: true }
    );

    // Update stats
    if (action !== 'dislike') {
      await User.findByIdAndUpdate(userId, { $inc: { 'stats.likes': 1 } });
    }

    // Check for match (if they liked us too)
    let isMatch = false;
    let matchData = null;

    if (action === 'like' || action === 'superlike') {
      const reciprocalSwipe = await Swipe.findOne({
        from: userId,
        to: req.user._id,
        action: { $in: ['like', 'superlike'] },
      });

      if (reciprocalSwipe) {
        isMatch = true;

        // Create match
        const match = await Match.create({
          users: [req.user._id, userId],
          initiator: reciprocalSwipe.from, // First person to like
          type: action === 'superlike' || reciprocalSwipe.action === 'superlike' 
            ? 'superlike_match' 
            : 'match',
          compatibility: {
            score: calculateCompatibility(req.user, targetUser).score,
          },
        });

        // Update stats
        await User.updateMany(
          { _id: { $in: [req.user._id, userId] } },
          { $inc: { 'stats.matches': 1 } }
        );

        matchData = {
          id: match._id,
          user: {
            id: targetUser._id,
            name: targetUser.name,
            photos: targetUser.photos,
          },
          compatibility: match.compatibility,
        };

        // TODO: Send push notification
      }
    }

    res.json({
      success: true,
      isMatch,
      match: matchData,
    });
  } catch (error) {
    console.error('Swipe error:', error);
    res.status(500).json({ success: false, message: 'Failed to process swipe' });
  }
});

// @route   DELETE /api/matches/:id
// @desc    Unmatch with a user
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const match = await Match.findOne({
      _id: req.params.id,
      users: req.user._id,
      status: 'active',
    });

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match not found' });
    }

    match.status = 'unmatched';
    match.unmatchedBy = req.user._id;
    match.unmatchedAt = new Date();
    await match.save();

    res.json({ success: true, message: 'Unmatched successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to unmatch' });
  }
});

// Helper function to calculate compatibility
function calculateCompatibility(user1, user2) {
  let score = 0;
  const factors = {};

  // Interest overlap (40% weight)
  const interests1 = new Set(user1.interests || []);
  const interests2 = new Set(user2.interests || []);
  const commonInterests = [...interests1].filter(i => interests2.has(i));
  const interestScore = interests1.size > 0 
    ? (commonInterests.length / Math.max(interests1.size, interests2.size)) * 100
    : 50;
  factors.interests = Math.round(interestScore);
  score += interestScore * 0.4;

  // Location proximity (20% weight)
  // TODO: Calculate actual distance
  factors.location = 80;
  score += 80 * 0.2;

  // Activity match (20% weight)
  const bothOnline = user1.isOnline && user2.isOnline;
  factors.activity = bothOnline ? 100 : 60;
  score += factors.activity * 0.2;

  // Preference match (20% weight)
  factors.preferences = 75;
  score += 75 * 0.2;

  return {
    score: Math.round(score),
    factors,
  };
}

module.exports = router;
