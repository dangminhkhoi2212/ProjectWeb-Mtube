const express = require('express');
const router = express.Router();
const VideoController = require('../controllers/video.controller');
const multer = require('../lib/multerConfig');
router.route('/:id').get(VideoController.findOne).put(VideoController.addView);
router
    .route('/:id/:videoId')
    .put(VideoController.addUserLike)
    .delete(VideoController.removeUserLike);

router
    .route('/:videoId')
    .put(VideoController.update)
    .delete(VideoController.delete);
router
    .route('/')
    .get(VideoController.findAll)
    .post(multer.single('video'), VideoController.create)
    .delete(VideoController.deleteAll);
module.exports = router;
