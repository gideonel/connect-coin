const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Upload options for different media types
const uploadOptions = {
  profile: {
    folder: 'dating-app/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 800, crop: 'fill', gravity: 'face' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
  },
  gallery: {
    folder: 'dating-app/gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit' },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ],
  },
  video: {
    folder: 'dating-app/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'webm', 'mov'],
    transformation: [
      { width: 720, crop: 'limit' },
      { quality: 'auto:good' }
    ],
  },
  verification: {
    folder: 'dating-app/verification',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [
      { width: 600, height: 600, crop: 'fill' },
      { quality: 'auto:good' }
    ],
  }
};

// Upload helper function
const uploadToCloudinary = async (file, type = 'gallery') => {
  try {
    const options = uploadOptions[type] || uploadOptions.gallery;
    const result = await cloudinary.uploader.upload(file, options);
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete helper function
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Generate optimized URL
const getOptimizedUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    ...options,
  });
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  getOptimizedUrl,
  uploadOptions,
};
