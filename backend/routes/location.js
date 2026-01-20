const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Initialize Mapbox client
const geocodingClient = mbxGeocoding({
  accessToken: process.env.MAPBOX_ACCESS_TOKEN,
});

// @route   PUT /api/location/update
// @desc    Update user's location
// @access  Private
router.put('/update', protect, [
  body('latitude').isFloat({ min: -90, max: 90 }),
  body('longitude').isFloat({ min: -180, max: 180 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { latitude, longitude } = req.body;

    // Reverse geocode to get city/country
    let city, country;
    try {
      const response = await geocodingClient.reverseGeocode({
        query: [longitude, latitude],
        types: ['place', 'country'],
      }).send();

      if (response.body.features.length > 0) {
        const features = response.body.features;
        const placeFeature = features.find(f => f.place_type.includes('place'));
        const countryFeature = features.find(f => f.place_type.includes('country'));
        
        city = placeFeature?.text;
        country = countryFeature?.text;
      }
    } catch (geoError) {
      console.error('Geocoding error:', geoError);
      // Continue without city/country
    }

    req.user.location = {
      type: 'Point',
      coordinates: [longitude, latitude],
      city,
      country,
      lastUpdated: new Date(),
    };
    await req.user.save();

    res.json({
      success: true,
      location: {
        coordinates: [longitude, latitude],
        city,
        country,
      },
    });
  } catch (error) {
    console.error('Location update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update location' });
  }
});

// @route   GET /api/location/nearby
// @desc    Get nearby users
// @access  Private
router.get('/nearby', protect, async (req, res) => {
  try {
    const { distance = 50, limit = 20, page = 1 } = req.query;

    if (!req.user.location?.coordinates || 
        (req.user.location.coordinates[0] === 0 && req.user.location.coordinates[1] === 0)) {
      return res.status(400).json({
        success: false,
        message: 'Please update your location first',
      });
    }

    const users = await User.find({
      _id: { $ne: req.user._id, $nin: req.user.blocked },
      status: 'active',
      'location.coordinates': {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: req.user.location.coordinates,
          },
          $maxDistance: parseInt(distance) * 1609.34, // Miles to meters
        },
      },
    })
      .select('name age photos location isOnline lastActive verified')
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    // Calculate distances
    const usersWithDistance = users.map(user => {
      const dist = calculateDistance(
        req.user.location.coordinates,
        user.location.coordinates
      );
      return {
        ...user.toObject(),
        distance: Math.round(dist * 10) / 10, // Round to 1 decimal
      };
    });

    res.json({
      success: true,
      users: usersWithDistance,
      total: usersWithDistance.length,
    });
  } catch (error) {
    console.error('Nearby users error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch nearby users' });
  }
});

// @route   GET /api/location/geocode
// @desc    Geocode an address
// @access  Private
router.get('/geocode', protect, async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ success: false, message: 'Query required' });
    }

    const response = await geocodingClient.forwardGeocode({
      query,
      limit: 5,
      types: ['place', 'locality', 'neighborhood'],
    }).send();

    const results = response.body.features.map(feature => ({
      id: feature.id,
      name: feature.place_name,
      coordinates: feature.center,
      context: feature.context,
    }));

    res.json({ success: true, results });
  } catch (error) {
    console.error('Geocode error:', error);
    res.status(500).json({ success: false, message: 'Geocoding failed' });
  }
});

// @route   GET /api/location/reverse
// @desc    Reverse geocode coordinates
// @access  Private
router.get('/reverse', protect, async (req, res) => {
  try {
    const { longitude, latitude } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ success: false, message: 'Coordinates required' });
    }

    const response = await geocodingClient.reverseGeocode({
      query: [parseFloat(longitude), parseFloat(latitude)],
      types: ['place', 'country', 'region'],
    }).send();

    if (response.body.features.length === 0) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    const feature = response.body.features[0];
    res.json({
      success: true,
      location: {
        name: feature.place_name,
        coordinates: feature.center,
      },
    });
  } catch (error) {
    console.error('Reverse geocode error:', error);
    res.status(500).json({ success: false, message: 'Reverse geocoding failed' });
  }
});

// @route   GET /api/location/distance
// @desc    Calculate distance between current user and another user
// @access  Private
router.get('/distance/:userId', protect, async (req, res) => {
  try {
    const otherUser = await User.findById(req.params.userId).select('location');

    if (!otherUser || !otherUser.location?.coordinates) {
      return res.status(404).json({ success: false, message: 'User location not available' });
    }

    if (!req.user.location?.coordinates) {
      return res.status(400).json({ success: false, message: 'Your location not set' });
    }

    const distance = calculateDistance(
      req.user.location.coordinates,
      otherUser.location.coordinates
    );

    res.json({
      success: true,
      distance: Math.round(distance * 10) / 10,
      unit: 'miles',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to calculate distance' });
  }
});

// Helper function to calculate distance using Haversine formula
function calculateDistance(coords1, coords2) {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const R = 3959; // Earth's radius in miles
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function toRad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = router;
