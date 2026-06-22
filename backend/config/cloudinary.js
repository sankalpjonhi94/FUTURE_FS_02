const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const path = require('path');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

let upload;

// If Cloudinary is configured, use it; otherwise fall back to local disk storage
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  const { CloudinaryStorage } = require('multer-storage-cloudinary');
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'crm_uploads',
      allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    },
  });
  upload = multer({ storage });
} else {
  // Fallback: save to local uploads folder
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
  });
  upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });
}

module.exports = { cloudinary, upload };
