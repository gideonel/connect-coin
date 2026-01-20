const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }],
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['match', 'superlike_match'],
    default: 'match',
  },
  compatibility: {
    score: { type: Number, min: 0, max: 100 },
    factors: {
      interests: Number,
      location: Number,
      activity: Number,
      preferences: Number,
    },
  },
  status: {
    type: String,
    enum: ['active', 'unmatched', 'blocked'],
    default: 'active',
  },
  unmatchedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  unmatchedAt: Date,
  lastInteraction: {
    type: Date,
    default: Date.now,
  },
  messageCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Indexes
matchSchema.index({ users: 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ createdAt: -1 });

// Static method to check if users are matched
matchSchema.statics.areMatched = async function(userId1, userId2) {
  const match = await this.findOne({
    users: { $all: [userId1, userId2] },
    status: 'active',
  });
  return !!match;
};

// Static method to get user's matches
matchSchema.statics.getUserMatches = async function(userId, options = {}) {
  const { page = 1, limit = 20, sort = '-createdAt' } = options;
  
  return await this.find({
    users: userId,
    status: 'active',
  })
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: 'users',
      select: 'name age photos isOnline lastActive',
    });
};

module.exports = mongoose.model('Match', matchSchema);

// Swipe/Like Schema (separate collection for performance)
const swipeSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: ['like', 'dislike', 'superlike'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000, // Auto-delete after 30 days (for dislikes)
  },
});

swipeSchema.index({ from: 1, to: 1 }, { unique: true });
swipeSchema.index({ to: 1, action: 1 });

const Swipe = mongoose.model('Swipe', swipeSchema);

module.exports.Swipe = Swipe;
