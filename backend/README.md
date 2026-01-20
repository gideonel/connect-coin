# Dating App Backend API Templates

This folder contains Node.js/Express backend API templates for the dating app system. These templates are designed to work with MongoDB, Paystack, Cloudinary, and Mapbox.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Payment**: Paystack API
- **Media**: Cloudinary for image/video uploads
- **Maps**: Mapbox for location services
- **Auth**: JWT with bcrypt

## Setup Instructions

### 1. Clone and Install

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend folder:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/dating_app

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Paystack
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxx
PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Mapbox
MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

### 3. Run the Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Structure

```
backend/
├── config/
│   ├── database.js       # MongoDB connection
│   ├── cloudinary.js     # Cloudinary config
│   └── paystack.js       # Paystack config
├── models/
│   ├── User.js           # User schema
│   ├── Match.js          # Match schema
│   ├── Message.js        # Message schema
│   ├── Subscription.js   # Subscription schema
│   └── Transaction.js    # Transaction schema
├── routes/
│   ├── auth.js           # Authentication routes
│   ├── users.js          # User management routes
│   ├── matches.js        # Matching routes
│   ├── messages.js       # Messaging routes
│   ├── payments.js       # Payment routes
│   ├── media.js          # Media upload routes
│   └── location.js       # Location/map routes
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── matchController.js
│   ├── messageController.js
│   ├── paymentController.js
│   ├── mediaController.js
│   └── locationController.js
├── middleware/
│   ├── auth.js           # JWT authentication
│   ├── upload.js         # Multer config
│   └── errorHandler.js   # Error handling
├── utils/
│   ├── paystack.js       # Paystack helpers
│   ├── cloudinary.js     # Cloudinary helpers
│   ├── mapbox.js         # Mapbox helpers
│   └── validators.js     # Input validation
├── app.js                # Express app setup
├── server.js             # Server entry point
└── package.json
```

## Features Covered

### Authentication
- User registration with email verification
- Login with JWT tokens
- Password reset
- Social authentication (Google, Facebook)

### User Management
- Profile CRUD operations
- Photo upload/management
- Preferences and settings
- Account verification

### Matching System
- Swipe actions (like, dislike, superlike)
- Match detection and notifications
- Compatibility scoring
- Discovery filters

### Messaging
- Real-time messaging (Socket.io ready)
- Message reactions
- Typing indicators
- Read receipts

### Payments (Paystack)
- Subscription plans
- Token/coin purchases
- Payment verification
- Webhook handling

### Media (Cloudinary)
- Photo uploads with optimization
- Video uploads
- Image moderation
- CDN delivery

### Location (Mapbox)
- Geocoding addresses
- Distance calculations
- Nearby users search
- Location privacy controls
