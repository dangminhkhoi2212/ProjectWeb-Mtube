const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');
const multer = require('../lib/multerConfig');
const verifyToken = require('../middleware/account.middleware');

router.route('/handleFollow').put(accountController.handleFollow);

// ---------------------------------------------//

router
    .route('/favorite/:id')
    .get(accountController.getFavorite)
    .delete(accountController.removeAllFavoriteVideo);
router
    .route('/favorite/:id/:videoId')
    .put(accountController.addFavoriteVideo)
    .delete(accountController.removeFavoriteVideo);

// ---------------------------------------------//

router.route('/myVideos/:id').delete(accountController.removeAllVideo);
router
    .route('/myVideos/:accountId/:videoId')
    .delete(accountController.removeMyVideo);

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
