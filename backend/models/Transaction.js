const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['subscription', 'tokens', 'coins', 'boost', 'superlike', 'refund'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'NGN',
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'bank', 'ussd', 'mobile_money'],
  },
  paystack: {
    reference: String,
    accessCode: String,
    authorizationUrl: String,
    transactionId: Number,
  },
  metadata: {
    plan: String,
    tokens: Number,
    coins: Number,
    boostDuration: Number,
  },
  refund: {
    reason: String,
    refundedAt: Date,
    refundReference: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
}, {
  timestamps: true,
});

// Indexes
transactionSchema.index({ user: 1, createdAt: -1 });
transactionSchema.index({ 'paystack.reference': 1 });
transactionSchema.index({ status: 1 });

// Static method to get user's transaction history
transactionSchema.statics.getUserTransactions = async function(userId, options = {}) {
  const { page = 1, limit = 20, type, status } = options;
  
  const query = { user: userId };
  if (type) query.type = type;
  if (status) query.status = status;
  
  return await this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

// Static method to calculate total spent
transactionSchema.statics.getTotalSpent = async function(userId) {
  const result = await this.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId), status: 'success' } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  return result[0]?.total || 0;
};

module.exports = mongoose.model('Transaction', transactionSchema);

// Subscription model
const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  plan: {
    type: String,
    enum: ['silver', 'gold', 'platinum'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'paused'],
    default: 'active',
  },
  paystack: {
    subscriptionCode: String,
    emailToken: String,
    customerCode: String,
  },
  currentPeriod: {
    start: Date,
    end: Date,
  },
  cancelledAt: Date,
  cancelReason: String,
  autoRenew: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ status: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports.Subscription = Subscription;
