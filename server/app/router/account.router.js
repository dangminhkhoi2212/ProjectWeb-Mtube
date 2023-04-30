const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');
const Account = require('../models/Account.model');
const ApiError = require('../api.error');
const uploadCloud = require('../config/cloudinary.config');

router
    .route('/myVideos/:id/:videoId')
    .put(accountController.addVideo)
    .delete(accountController.removeVideo);
router.route('/myVideos/:id').delete(accountController.removeAllVideo);
router
    .route('/:id')
    .get(accountController.findById)
    .put(uploadCloud.single('image'), accountController.update)
    .delete(accountController.delete);

router.route('/login').post(accountController.findOneAccount);
router
    .route('/')
    .get(accountController.findAll)
    .post(uploadCloud.single('image'), accountController.create)
    .delete(accountController.deleteAll);
module.exports = router;
