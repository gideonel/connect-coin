const Paystack = require('paystack-api');

// Initialize Paystack with secret key
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY);

// Subscription plans configuration
const subscriptionPlans = {
  silver: {
    name: 'Silver',
    code: 'PLN_silver_monthly',
    amount: 999, // Amount in kobo (₦9.99)
    interval: 'monthly',
    features: [
      'See who likes you',
      'Unlimited likes',
      '5 Super Likes per day',
      'No ads',
    ],
  },
  gold: {
    name: 'Gold',
    code: 'PLN_gold_monthly',
    amount: 1999,
    interval: 'monthly',
    features: [
      'All Silver features',
      'Priority likes',
      'See who viewed you',
      'Advanced filters',
      '10 Super Likes per day',
    ],
  },
  platinum: {
    name: 'Platinum',
    code: 'PLN_platinum_monthly',
    amount: 2999,
    interval: 'monthly',
    features: [
      'All Gold features',
      'Message before matching',
      'Incognito mode',
      'Unlimited Super Likes',
      'Profile boost weekly',
    ],
  },
};

// Token packages for one-time purchases
const tokenPackages = {
  starter: {
    id: 'tokens_100',
    tokens: 100,
    bonus: 0,
    amount: 499, // ₦4.99
  },
  popular: {
    id: 'tokens_500',
    tokens: 500,
    bonus: 50,
    amount: 1999,
  },
  best_value: {
    id: 'tokens_1000',
    tokens: 1000,
    bonus: 200,
    amount: 3499,
  },
};

// Initialize a transaction
const initializeTransaction = async (email, amount, metadata = {}) => {
  try {
    const response = await paystack.transaction.initialize({
      email,
      amount: amount * 100, // Convert to kobo
      metadata,
      callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Verify a transaction
const verifyTransaction = async (reference) => {
  try {
    const response = await paystack.transaction.verify({ reference });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Create a subscription
const createSubscription = async (customer, plan) => {
  try {
    const response = await paystack.subscription.create({
      customer,
      plan,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Cancel a subscription
const cancelSubscription = async (code, token) => {
  try {
    const response = await paystack.subscription.disable({
      code,
      token,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Webhook signature verification
const verifyWebhookSignature = (payload, signature) => {
  const crypto = require('crypto');
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(payload))
    .digest('hex');
  return hash === signature;
};

module.exports = {
  paystack,
  subscriptionPlans,
  tokenPackages,
  initializeTransaction,
  verifyTransaction,
  createSubscription,
  cancelSubscription,
  verifyWebhookSignature,
};
