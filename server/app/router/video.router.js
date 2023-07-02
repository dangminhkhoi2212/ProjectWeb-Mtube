const express = require('express');
const router = express.Router();
const VideoController = require('../controllers/video.controller');
const multer = require('../lib/multerConfig');
const verifyToken = require('../middleware/account.middleware');

router
    .route('/:videoId')
    .get(VideoController.findOne)
    .put(verifyToken, VideoController.update)
    .delete(verifyToken, VideoController.delete);

router
    .route('/')
    .get(VideoController.findAll)
    .post(verifyToken, multer.single('video'), VideoController.create)
    .delete(verifyToken, VideoController.deleteAll);
module.exports = router;
