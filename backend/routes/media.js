const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadOptions,
} = require('../config/cloudinary');

// Configure multer with Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const type = req.query.type || 'gallery';
    return uploadOptions[type] || uploadOptions.gallery;
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
});

// @route   POST /api/media/upload
// @desc    Upload a photo
// @access  Private
router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { type = 'gallery', isMain = false } = req.query;

    // Check photo limit
    if (type !== 'verification' && req.user.photos.length >= 6) {
      // Delete uploaded file
      await deleteFromCloudinary(req.file.filename);
      return res.status(400).json({ 
        success: false, 
        message: 'Maximum 6 photos allowed' 
      });
    }

    const photoData = {
      url: req.file.path,
      publicId: req.file.filename,
      isMain: isMain === 'true' || req.user.photos.length === 0,
      order: req.user.photos.length,
    };

    // If setting as main, unset other main photos
    if (photoData.isMain) {
      req.user.photos.forEach(p => p.isMain = false);
    }

    if (type === 'verification') {
      req.user.verification.photoUrl = req.file.path;
      req.user.verification.photoSubmittedAt = new Date();
    } else {
      req.user.photos.push(photoData);
    }

    await req.user.save();

    res.json({
      success: true,
      photo: photoData,
      message: type === 'verification' 
        ? 'Verification photo submitted' 
        : 'Photo uploaded successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// @route   POST /api/media/upload-multiple
// @desc    Upload multiple photos
// @access  Private
router.post('/upload-multiple', protect, upload.array('images', 6), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const remainingSlots = 6 - req.user.photos.length;
    if (req.files.length > remainingSlots) {
      // Delete extra uploaded files
      const filesToDelete = req.files.slice(remainingSlots);
      for (const file of filesToDelete) {
        await deleteFromCloudinary(file.filename);
      }
      req.files = req.files.slice(0, remainingSlots);
    }

    const newPhotos = req.files.map((file, index) => ({
      url: file.path,
      publicId: file.filename,
      isMain: req.user.photos.length === 0 && index === 0,
      order: req.user.photos.length + index,
    }));

    req.user.photos.push(...newPhotos);
    await req.user.save();

    res.json({
      success: true,
      photos: newPhotos,
      message: `${newPhotos.length} photos uploaded successfully`,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

// @route   DELETE /api/media/:publicId
// @desc    Delete a photo
// @access  Private
router.delete('/:publicId', protect, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const photoIndex = req.user.photos.findIndex(
      p => p.publicId === publicId || p.publicId.includes(publicId)
    );

    if (photoIndex === -1) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    const photo = req.user.photos[photoIndex];

    // Delete from Cloudinary
    await deleteFromCloudinary(photo.publicId);

    // Remove from user's photos
    req.user.photos.splice(photoIndex, 1);

    // If deleted photo was main, set first photo as main
    if (photo.isMain && req.user.photos.length > 0) {
      req.user.photos[0].isMain = true;
    }

    // Reorder remaining photos
    req.user.photos.forEach((p, index) => {
      p.order = index;
    });

    await req.user.save();

    res.json({ success: true, message: 'Photo deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete photo' });
  }
});

// @route   PUT /api/media/reorder
// @desc    Reorder photos
// @access  Private
router.put('/reorder', protect, async (req, res) => {
  try {
    const { order } = req.body; // Array of publicIds in new order

    if (!Array.isArray(order) || order.length !== req.user.photos.length) {
      return res.status(400).json({ success: false, message: 'Invalid order' });
    }

    const reorderedPhotos = order.map((publicId, index) => {
      const photo = req.user.photos.find(p => p.publicId === publicId);
      if (!photo) throw new Error('Photo not found');
      return {
        ...photo.toObject(),
        order: index,
        isMain: index === 0,
      };
    });

    req.user.photos = reorderedPhotos;
    await req.user.save();

    res.json({ success: true, photos: req.user.photos });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({ success: false, message: 'Failed to reorder photos' });
  }
});

// @route   PUT /api/media/:publicId/main
// @desc    Set photo as main
// @access  Private
router.put('/:publicId/main', protect, async (req, res) => {
  try {
    const { publicId } = req.params;

    const photo = req.user.photos.find(p => p.publicId === publicId);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    // Unset all main photos and set this one
    req.user.photos.forEach(p => {
      p.isMain = p.publicId === publicId;
    });

    await req.user.save();

    res.json({ success: true, message: 'Main photo updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update main photo' });
  }
});

module.exports = router;
