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

router
    .route('/:id')
    .get(accountController.findById)
    .put(verifyToken, multer.single('avatar'), accountController.updateAccount)
    .delete(accountController.deleteAccount);

// ---------------------------------------------//

router
    .route('/editDetail/:accountId')
    .put(verifyToken, accountController.editDetail);

router.route('/login').post(accountController.login);

// ---------------------------------------------//

router
    .route('/')
    .get(accountController.findAll)
    .post(multer.single('avatar'), accountController.createAccount)
    .delete(accountController.deleteAll);
module.exports = router;
