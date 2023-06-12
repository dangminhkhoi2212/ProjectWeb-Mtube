const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');
const Account = require('../models/Account.model');
const ApiError = require('../api.error');
const multer = require('../lib/multerConfig');
const cloudinary = require('../lib/cloudinary');
const verifyToken = require('../middleware/account.middleware');

router
    .route('/myVideos/:id/:videoId')
    .put(accountController.addFavoriteVideo)
    .delete(accountController.removeVideo);
router.route('/myVideos/:id').delete(accountController.removeAllVideo);
router
    .route('/:id')
    .get(accountController.findById)
    .put(verifyToken, multer.single('avatar'), accountController.update)
    .delete(accountController.delete);
router.route('/login').post(accountController.login);
router
    .route('/')
    .get(accountController.findAll)
    .post(multer.single('avatar'), accountController.create)
    .delete(accountController.deleteAll);
module.exports = router;
