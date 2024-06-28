const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require("multer");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    map_token: process.env.MAP_TOKEN
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowerdFormats: ["png", "jpg", "jpeg"], // supports promises as well
    },
  });

// Create a multer instance with the Cloudinary storage engine
const upload = multer({storage: storage});

module.exports = upload;