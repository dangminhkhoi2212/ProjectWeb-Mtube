const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();
cloudinary.config({
    cloud_name: process.env.CLOUNDINARY_CLOUND_NAME,
    api_key: process.env.CLOUNDINARY_API_KEY,
    api_secret: process.env.CLOUNDINARY_API_SECRET,
});

const imageStorage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'account_avatar',
    },
});
const videoStorage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['mp4'],
    params: {
        folder: 'upload_videos',
    },
});
const uploadCloud = {
    imageUpload: multer({
        storage: imageStorage,
    }),
    videoUpload: multer({
        storage: videoStorage,
    }),
};

module.exports = uploadCloud;
