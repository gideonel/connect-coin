const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  match: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: function() {
      return !this.mediaUrl;
    },
    maxlength: [2000, 'Message cannot exceed 2000 characters'],
  },
  type: {
    type: String,
    enum: ['text', 'image', 'gif', 'audio', 'icebreaker'],
    default: 'text',
  },
  mediaUrl: String,
  mediaPublicId: String,
  icebreaker: {
    type: String,
    enum: [
      'two_truths_lie',
      'would_you_rather',
      'this_or_that',
      'unpopular_opinion',
      'bucket_list',
    ],
  },
  reactions: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emoji: String,
    createdAt: { type: Date, default: Date.now },
  }],
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read'],
    default: 'sent',
  },
  readAt: Date,
  deliveredAt: Date,
  isEdited: { type: Boolean, default: false },
  editedAt: Date,
  isDeleted: { type: Boolean, default: false },
  deletedAt: Date,
  deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
});

// Indexes
messageSchema.index({ match: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });
messageSchema.index({ receiver: 1, status: 1 });

// Virtual for formatted content (handles deleted messages)
messageSchema.virtual('displayContent').get(function() {
  if (this.isDeleted) {
    return 'This message was deleted';
  }
  return this.content;
});

// Static method to get conversation
messageSchema.statics.getConversation = async function(matchId, options = {}) {
  const { page = 1, limit = 50, before } = options;
  
  const query = { match: matchId, isDeleted: false };
  if (before) {
    query.createdAt = { $lt: before };
  }
  
  return await this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('sender', 'name photos')
    .populate('replyTo', 'content sender');
};

// Static method to mark messages as read
messageSchema.statics.markAsRead = async function(matchId, userId) {
  const now = new Date();
  return await this.updateMany(
    {
      match: matchId,
      receiver: userId,
      status: { $ne: 'read' },
    },
    {
      $set: { status: 'read', readAt: now },
    }
  );
};

// Static method to get unread count
messageSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    receiver: userId,
    status: { $ne: 'read' },
    isDeleted: false,
  });
};

module.exports = mongoose.model('Message', messageSchema);
