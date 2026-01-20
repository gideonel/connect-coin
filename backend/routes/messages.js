const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const Match = require('../models/Match');
const { protect } = require('../middleware/auth');

// @route   GET /api/messages/:matchId
// @desc    Get conversation messages
// @access  Private
router.get('/:matchId', protect, async (req, res) => {
  try {
    const { page = 1, limit = 50, before } = req.query;

    // Verify user is part of this match
    const match = await Match.findOne({
      _id: req.params.matchId,
      users: req.user._id,
      status: 'active',
    });

    if (!match) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const messages = await Message.getConversation(req.params.matchId, {
      page: parseInt(page),
      limit: parseInt(limit),
      before: before ? new Date(before) : undefined,
    });

    // Mark messages as read
    await Message.markAsRead(req.params.matchId, req.user._id);

    res.json({
      success: true,
      messages: messages.reverse(), // Return in chronological order
      hasMore: messages.length === parseInt(limit),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
});

// @route   POST /api/messages/:matchId
// @desc    Send a message
// @access  Private
router.post('/:matchId', protect, [
  body('content').optional().isLength({ min: 1, max: 2000 }),
  body('type').optional().isIn(['text', 'image', 'gif', 'audio', 'icebreaker']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { content, type = 'text', mediaUrl, icebreaker, replyTo } = req.body;

    // Verify match exists and is active
    const match = await Match.findOne({
      _id: req.params.matchId,
      users: req.user._id,
      status: 'active',
    });

    if (!match) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    // Get the other user
    const receiverId = match.users.find(u => u.toString() !== req.user._id.toString());

    // Create message
    const message = await Message.create({
      match: req.params.matchId,
      sender: req.user._id,
      receiver: receiverId,
      content,
      type,
      mediaUrl,
      icebreaker,
      replyTo,
    });

    // Update match last interaction
    match.lastInteraction = new Date();
    match.messageCount += 1;
    await match.save();

    // Populate sender info
    await message.populate('sender', 'name photos');
    if (replyTo) {
      await message.populate('replyTo', 'content sender');
    }

    // TODO: Emit socket event for real-time delivery
    // TODO: Send push notification

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ success: false, message: 'Failed to send message' });
  }
});

// @route   PUT /api/messages/:id
// @desc    Edit a message
// @access  Private
router.put('/:id', protect, [
  body('content').isLength({ min: 1, max: 2000 }),
], async (req, res) => {
  try {
    const message = await Message.findOne({
      _id: req.params.id,
      sender: req.user._id,
      isDeleted: false,
    });

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Only allow editing within 15 minutes
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (message.createdAt < fifteenMinutesAgo) {
      return res.status(400).json({ success: false, message: 'Message too old to edit' });
    }

    message.content = req.body.content;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to edit message' });
  }
});

// @route   DELETE /api/messages/:id
// @desc    Delete a message
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const { forEveryone } = req.query;

    const message = await Message.findOne({
      _id: req.params.id,
      $or: [
        { sender: req.user._id },
        { receiver: req.user._id },
      ],
    });

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (forEveryone === 'true' && message.sender.toString() === req.user._id.toString()) {
      // Delete for everyone (sender only)
      message.isDeleted = true;
      message.deletedAt = new Date();
      message.content = '';
    } else {
      // Delete only for this user
      message.deletedFor.push(req.user._id);
    }

    await message.save();

    res.json({ success: true, message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
});

// @route   POST /api/messages/:id/react
// @desc    Add reaction to a message
// @access  Private
router.post('/:id/react', protect, [
  body('emoji').isLength({ min: 1, max: 4 }),
], async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    // Remove existing reaction from this user
    message.reactions = message.reactions.filter(
      r => r.user.toString() !== req.user._id.toString()
    );

    // Add new reaction
    message.reactions.push({
      user: req.user._id,
      emoji: req.body.emoji,
    });

    await message.save();

    res.json({ success: true, reactions: message.reactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add reaction' });
  }
});

// @route   DELETE /api/messages/:id/react
// @desc    Remove reaction from a message
// @access  Private
router.delete('/:id/react', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.reactions = message.reactions.filter(
      r => r.user.toString() !== req.user._id.toString()
    );

    await message.save();

    res.json({ success: true, reactions: message.reactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to remove reaction' });
  }
});

// @route   GET /api/messages/unread/count
// @desc    Get unread message count
// @access  Private
router.get('/unread/count', protect, async (req, res) => {
  try {
    const count = await Message.getUnreadCount(req.user._id);
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to get unread count' });
  }
});

module.exports = router;
