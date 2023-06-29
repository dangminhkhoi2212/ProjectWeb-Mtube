const express = require('express');
const router = express.Router();
const VideoController = require('../controllers/video.controller');
const multer = require('../lib/multerConfig');
router
    .route('/:videoId')
    .get(VideoController.findOne)
    .put(VideoController.update)
    .delete(VideoController.delete);

router
    .route('/')
    .get(VideoController.findAll)
    .post(multer.single('video'), VideoController.create)
    .delete(VideoController.deleteAll);
module.exports = router;
