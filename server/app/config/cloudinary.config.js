const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: 'dakwyskfm',
    api_key: '253915897887594',
    api_secret: '6cuhDK6jLdGK_vALQ6wY38zv3yA',
});

const storage = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'account_avatar',
    },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
