const multer = require('multer');
const path = require('path');
const ApiError = require('../api.error');
const maxSize = 10 * 1024 * 1024;

// Multer config
const storage = multer.diskStorage({});
const fileFilter = (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
        ext !== '.mp4' &&
        ext !== '.mkv' &&
        ext !== '.jpeg' &&
        ext !== '.jpg' &&
        ext !== '.png' &&
        ext !== '.gif' &&
        ext !== '.pdf' &&
        ext !== '.docx' &&
        ext !== '.doc'
    ) {
        return cb(new ApiError(403, 'File type is not supported'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: fileFilter,
});

module.exports = upload;
