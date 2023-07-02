const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comment.controller');
const verifyToken = require('../middleware/account.middleware');

router
    .route('/:videoId')
    .get(commentController.findAll)
    .delete(verifyToken, commentController.deleteAll);
router
    .route('/one/:id')
    .get(commentController.findOne)
    .put(verifyToken, commentController.update)
    .delete(verifyToken, commentController.delete);
router
    .route('/')
    .post(verifyToken, commentController.create)
    .delete(verifyToken, commentController.deleteAll);
module.exports = router;
