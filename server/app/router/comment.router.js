const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');

router
    .route('/:videoId')
    .get(commentController.findAll)
    .delete(commentController.deleteAll);
router
    .route('/one/:id')
    .get(commentController.findOne)
    .put(commentController.update)
    .delete(commentController.delete);
router
    .route('/')
    .post(commentController.create)
    .delete(commentController.deleteAll);
module.exports = router;
