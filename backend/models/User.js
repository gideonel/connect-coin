const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [18, 'Must be at least 18 years old'],
    max: [100, 'Age cannot exceed 100'],
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'other'],
    required: true,
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
  },
  photos: [{
    url: String,
    publicId: String,
    isMain: { type: Boolean, default: false },
    order: Number,
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
    },
    city: String,
    country: String,
    lastUpdated: Date,
  },
  interests: [{
    type: String,
    trim: true,
  }],
  lookingFor: {
    gender: [{ type: String, enum: ['male', 'female', 'non-binary', 'other', 'all'] }],
    ageRange: {
      min: { type: Number, default: 18 },
      max: { type: Number, default: 50 },
    },
    distance: { type: Number, default: 50 }, // in miles
    relationshipType: {
      type: String,
      enum: ['casual', 'serious', 'friendship', 'any'],
      default: 'any',
    },
  },
  premium: {
    isActive: { type: Boolean, default: false },
    plan: { type: String, enum: ['silver', 'gold', 'platinum'] },
    expiresAt: Date,
    subscriptionId: String,
  },
  tokens: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  stats: {
    likes: { type: Number, default: 0 },
    superLikes: { type: Number, default: 0 },
    matches: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
  },
  dailyLimits: {
    likes: { count: Number, resetAt: Date },
    superLikes: { count: Number, resetAt: Date },
  },
  verification: {
    email: { type: Boolean, default: false },
    phone: { type: Boolean, default: false },
    photo: { type: Boolean, default: false },
    photoSubmittedAt: Date,
    photoUrl: String,
  },
  settings: {
    showOnlineStatus: { type: Boolean, default: true },
    showDistance: { type: Boolean, default: true },
    showAge: { type: Boolean, default: true },
    notifications: {
      matches: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      likes: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
    privacy: {
      incognito: { type: Boolean, default: false },
      hideFromSearch: { type: Boolean, default: false },
    },
  },
  blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  reported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isOnline: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['active', 'paused', 'banned', 'deleted'],
    default: 'active',
  },
  banReason: String,
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes
userSchema.index({ 'location.coordinates': '2dsphere' });
userSchema.index({ email: 1 });
userSchema.index({ status: 1 });
userSchema.index({ 'premium.isActive': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for age verification
userSchema.virtual('isVerified').get(function() {
  return this.verification.email && this.verification.photo;
});

// Virtual for main photo
userSchema.virtual('mainPhoto').get(function() {
  const main = this.photos.find(p => p.isMain);
  return main ? main.url : this.photos[0]?.url;
});

module.exports = mongoose.model('User', userSchema);
