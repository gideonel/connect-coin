const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Transaction = require('../models/Transaction');
const { Subscription } = require('../models/Transaction');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const {
  subscriptionPlans,
  tokenPackages,
  initializeTransaction,
  verifyTransaction,
  createSubscription,
  cancelSubscription,
  verifyWebhookSignature,
} = require('../config/paystack');

// @route   GET /api/payments/plans
// @desc    Get available subscription plans
// @access  Public
router.get('/plans', (req, res) => {
  res.json({ success: true, plans: subscriptionPlans });
});

// @route   GET /api/payments/tokens
// @desc    Get available token packages
// @access  Public
router.get('/tokens', (req, res) => {
  res.json({ success: true, packages: tokenPackages });
});

// @route   POST /api/payments/subscribe
// @desc    Initialize subscription payment
// @access  Private
router.post('/subscribe', protect, [
  body('plan').isIn(['silver', 'gold', 'platinum']),
], async (req, res) => {
  try {
    const { plan } = req.body;
    const planDetails = subscriptionPlans[plan];

    if (!planDetails) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    // Initialize Paystack transaction
    const result = await initializeTransaction(
      req.user.email,
      planDetails.amount,
      {
        type: 'subscription',
        plan,
        userId: req.user._id.toString(),
      }
    );

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }

    // Create pending transaction
    await Transaction.create({
      user: req.user._id,
      type: 'subscription',
      amount: planDetails.amount,
      status: 'pending',
      paystack: {
        reference: result.data.reference,
        accessCode: result.data.access_code,
        authorizationUrl: result.data.authorization_url,
      },
      metadata: { plan },
    });

    res.json({
      success: true,
      authorizationUrl: result.data.authorization_url,
      reference: result.data.reference,
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ success: false, message: 'Failed to initialize payment' });
  }
});

// @route   POST /api/payments/tokens/purchase
// @desc    Purchase tokens
// @access  Private
router.post('/tokens/purchase', protect, [
  body('package').isIn(['starter', 'popular', 'best_value']),
], async (req, res) => {
  try {
    const { package: packageId } = req.body;
    const tokenPackage = tokenPackages[packageId];

    if (!tokenPackage) {
      return res.status(400).json({ success: false, message: 'Invalid package' });
    }

    // Initialize Paystack transaction
    const result = await initializeTransaction(
      req.user.email,
      tokenPackage.amount,
      {
        type: 'tokens',
        package: packageId,
        tokens: tokenPackage.tokens + tokenPackage.bonus,
        userId: req.user._id.toString(),
      }
    );

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }

    // Create pending transaction
    await Transaction.create({
      user: req.user._id,
      type: 'tokens',
      amount: tokenPackage.amount,
      status: 'pending',
      paystack: {
        reference: result.data.reference,
        accessCode: result.data.access_code,
        authorizationUrl: result.data.authorization_url,
      },
      metadata: {
        tokens: tokenPackage.tokens + tokenPackage.bonus,
      },
    });

    res.json({
      success: true,
      authorizationUrl: result.data.authorization_url,
      reference: result.data.reference,
    });
  } catch (error) {
    console.error('Token purchase error:', error);
    res.status(500).json({ success: false, message: 'Failed to initialize payment' });
  }
});

// @route   GET /api/payments/verify/:reference
// @desc    Verify payment
// @access  Private
router.get('/verify/:reference', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      'paystack.reference': req.params.reference,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.status === 'success') {
      return res.json({ success: true, status: 'success', transaction });
    }

    // Verify with Paystack
    const result = await verifyTransaction(req.params.reference);

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }

    const { status, metadata } = result.data;

    if (status === 'success') {
      transaction.status = 'success';
      transaction.completedAt = new Date();
      transaction.paystack.transactionId = result.data.id;
      await transaction.save();

      // Process the purchase
      if (transaction.type === 'subscription') {
        await processSubscription(req.user, metadata.plan);
      } else if (transaction.type === 'tokens') {
        await processTokenPurchase(req.user, metadata.tokens);
      }

      res.json({ success: true, status: 'success', transaction });
    } else {
      transaction.status = 'failed';
      await transaction.save();

      res.json({ success: false, status: 'failed' });
    }
  } catch (error) {
    console.error('Verify error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify payment' });
  }
});

// @route   POST /api/payments/webhook
// @desc    Paystack webhook handler
// @access  Public (webhook)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-paystack-signature'];
    
    if (!verifyWebhookSignature(req.body, signature)) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const event = JSON.parse(req.body);

    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data);
        break;
      case 'subscription.create':
        await handleSubscriptionCreate(event.data);
        break;
      case 'subscription.disable':
        await handleSubscriptionCancel(event.data);
        break;
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data);
        break;
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false });
  }
});

// @route   POST /api/payments/subscription/cancel
// @desc    Cancel subscription
// @access  Private
router.post('/subscription/cancel', protect, async (req, res) => {
  try {
    if (!req.user.premium.isActive || !req.user.premium.subscriptionId) {
      return res.status(400).json({ success: false, message: 'No active subscription' });
    }

    const subscription = await Subscription.findOne({
      user: req.user._id,
      status: 'active',
    });

    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    // Cancel with Paystack
    const result = await cancelSubscription(
      subscription.paystack.subscriptionCode,
      subscription.paystack.emailToken
    );

    if (!result.success) {
      return res.status(400).json({ success: false, message: result.error });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.cancelReason = req.body.reason;
    await subscription.save();

    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to cancel subscription' });
  }
});

// @route   GET /api/payments/transactions
// @desc    Get user's transaction history
// @access  Private
router.get('/transactions', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;

    const transactions = await Transaction.getUserTransactions(req.user._id, {
      page: parseInt(page),
      limit: parseInt(limit),
      type,
    });

    res.json({ success: true, transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch transactions' });
  }
});

// Helper functions
async function processSubscription(user, plan) {
  const planDetails = subscriptionPlans[plan];
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1);

  user.premium = {
    isActive: true,
    plan,
    expiresAt,
  };
  await user.save();
}

async function processTokenPurchase(user, tokens) {
  user.tokens += tokens;
  await user.save();
}

async function handleChargeSuccess(data) {
  const { reference, metadata } = data;
  
  const transaction = await Transaction.findOne({ 'paystack.reference': reference });
  if (!transaction || transaction.status === 'success') return;

  transaction.status = 'success';
  transaction.completedAt = new Date();
  await transaction.save();

  const user = await User.findById(metadata.userId);
  if (!user) return;

  if (metadata.type === 'subscription') {
    await processSubscription(user, metadata.plan);
  } else if (metadata.type === 'tokens') {
    await processTokenPurchase(user, metadata.tokens);
  }
}

async function handleSubscriptionCreate(data) {
  // Handle new subscription creation
}

async function handleSubscriptionCancel(data) {
  // Handle subscription cancellation
}

async function handlePaymentFailed(data) {
  // Handle failed payment
}

module.exports = router;
