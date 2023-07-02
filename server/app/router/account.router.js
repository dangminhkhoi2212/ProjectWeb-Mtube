const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');
const multer = require('../lib/multerConfig');
const verifyToken = require('../middleware/account.middleware');

router.route('/handleFollow').put(verifyToken, accountController.handleFollow);

// ---------------------------------------------//

router
    .route('/favorite/:id')
    .get(verifyToken, accountController.getFavorite)
    .delete(verifyToken, accountController.removeAllFavoriteVideo);
router
    .route('/favorite/:id/:videoId')
    .put(verifyToken, accountController.addFavoriteVideo)
    .delete(verifyToken, accountController.removeFavoriteVideo);

// ---------------------------------------------//

router
    .route('/myVideos/:id')
    .delete(verifyToken, accountController.removeAllVideo);
router
    .route('/myVideos/:accountId/:videoId')
    .delete(verifyToken, accountController.removeMyVideo);

// ---------------------------------------------//

router.route('/login').post(accountController.login);

// ---------------------------------------------//

router
    .route('/:id')
    .post(verifyToken, accountController.deleteAccount)
    .get(accountController.findById)
    .put(verifyToken, multer.single('image'), accountController.updateAccount);

// ---------------------------------------------//
router
    .route('/')
    .get(accountController.findAll)
    .post(multer.single('avatar'), accountController.createAccount);
module.exports = router;
