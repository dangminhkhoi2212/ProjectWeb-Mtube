const Account = require('../models/Account.model');
const ApiError = require('../api.error');
const AccountModel = require('../models/Account.model');
const cloudinary = require('../lib/cloudinary');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
class Methods {
    async findAll(req, res, next) {
        var documents = [];
        const namerequire = req.query.name;
        try {
            if (namerequire) {
                documents = await Account.find({
                    name: { $regex: `${namerequire}`, $options: 'i' },
                }).populate('myVideos');
            } else {
                documents = await Account.find({}).populate('myVideos');
            }
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    'An error occurent while retrieving accounts',
                ),
            );
        }
        return res.send(documents);
    }
    async checkAccountExist(id = null, username = null, email = null) {
        try {
            var check;
            if (username) {
                check = await Account.find({
                    $and: [
                        { _id: { $ne: id } },
                        {
                            $or: [{ username }, { email }],
                        },
                    ],
                });
            }
            return check.length !== 0 ? true : false;
        } catch (error) {
            return next(new ApiError(400, error.message));
        }
    }
    async create(req, res, next) {
        var methods = new Methods();
        var newAccount = req.body;
        //hash pasword
        newAccount.password = bcrypt.hashSync(newAccount.password, 10);
        newAccount.avatar = {};

        if (
            await methods.checkAccountExist(
                null,
                newAccount.username,
                newAccount.email,
            )
        )
            return next(new ApiError(400, 'Username or email existed'));

        if (newAccount.name && !newAccount.name.trim()) {
            return next(new ApiError(400, 'Name can not be empty'));
        }
        const file = req.file;
        if (!file) {
            return res.send('Please pick a file');
        }
        cloudinary.uploader.upload(
            file.path,
            {
                resource_type: 'image',
                folder: 'account_avatar',
            },
            async (err, result) => {
                if (err) {
                    return next(new ApiError(err.code || 500, err.message));
                }
                newAccount.avatar.public_id = result.public_id;
                newAccount.avatar.url = result.url;
                await Account.create(newAccount)
                    .then((data) => res.send(data))
                    .catch((error) => {
                        return next(new ApiError(400, error.message));
                    });
            },
        );
    }
    async deleteAll(req, res, next) {
        await Account.deleteMany({})
            .then((result) =>
                res.send(
                    `${result.deletedCount} account were deleted successfully`,
                ),
            )
            .catch((error) =>
                next(
                    new ApiError(
                        500,
                        'An error occurred while removing all accounts',
                    ),
                ),
            );
    }
    async findById(req, res, next) {
        await Account.findById(req.params.id)
            .populate('favoriteVideos')
            .then((data) => res.send(data))
            .catch((error) => next(new ApiError(404, 'Account not found')));
    }
    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            console.log({ username });

            const account = await Account.findOne({ username });
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }

            const invalid = await bcrypt.compare(password, account.password);
            if (!invalid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const token = await jwt.sign(
                { accountId: account._id },
                process.env.ACCESS_TOKEN_SECRET,
            );
            account.token = token;
            const result = await account.save();

            return res.send(result);
        } catch (error) {
            next(new ApiError(500, error.message));
        }
    }
    async addFavoriteVideo(req, res, next) {
        const id = req.params.id;
        const videoId = req.params.videoId;
        var accountUpdate = await Account.findById(id)
            .then((data) => data)
            .catch((err) => console.log(err));
        var exist = 0;
        accountUpdate.favoriteVideos.forEach((idExist) => {
            if (idExist.toString() === videoId) {
                exist = 1;
                return;
            }
        });
        if (exist == 1) {
            res.send({
                added: false,
                message: 'Video Exist!',
            });
        } else {
            accountUpdate.favoriteVideos.push(videoId);
            await accountUpdate
                .save()
                .then((data) =>
                    res.send({
                        added: true,
                        message: 'Added this video into My Videos',
                    }),
                )
                .catch((error) => {
                    return next(
                        new ApiError(
                            500,
                            'An error occurred while creating the accounts',
                        ),
                    );
                });
        }
    }
    async removeVideo(req, res, next) {
        const id = req.params.id;
        const videoId = req.params.videoId;
        const accountUpdate = await Account.findById(id)
            .populate('favoriteVideos')
            .then((data) => data)
            .catch((err) => console.log(err));
        var index = -1;
        accountUpdate.favoriteVideos.forEach((video, i) => {
            if (JSON.parse(JSON.stringify(video._id)) === videoId) {
                index = i;
            }
        });
        if (index !== -1) {
            accountUpdate.favoriteVideos.splice(index, 1);
        }
        await accountUpdate
            .save()
            .then((data) => res.send(data))
            .catch((error) => {
                return next(
                    new ApiError(
                        500,
                        'An error occurred while delete the video',
                    ),
                );
            });
    }
    async removeAllVideo(req, res, next) {
        const id = req.params.id;
        const accountUpdate = await Account.findById(id)
            .populate('favoriteVideos')
            .then((data) => data)
            .catch((err) => console.log(err));
        accountUpdate.favoriteVideos = [];
        await accountUpdate
            .save()
            .then((data) => res.send(data))
            .catch((error) => {
                return next(
                    new ApiError(
                        500,
                        'An error occurred while delete the video',
                    ),
                );
            });
    }
    async update(req, res, next) {
        try {
            var methods = new Methods();
            var id = req.params.id;

            const file = req.file;
            var oldAccount = await AccountModel.findById(id).then(
                (result) => result,
            );
            var newAccount = req.body;
            if (newAccount.name && !newAccount.name.trim()) {
                return res
                    .status(400)
                    .json({ message: 'Name can not be empty' });
            }
            if (
                (newAccount.name &&
                    newAccount.email &&
                    oldAccount.username !== newAccount.username) ||
                oldAccount.email !== newAccount.email
            ) {
                if (
                    await methods.checkAccountExist(
                        id,
                        newAccount.username,
                        newAccount.email,
                    )
                )
                    return res.status(400).send('Username or email existed');
            }
            if (file) {
                // delete old image at uploads folder
                cloudinary.uploader.destroy(oldAccount.avatar.public_id);
                //update new avatar
                cloudinary.uploader.upload(
                    file.path,
                    {
                        resource_type: 'image',
                        folder: 'account_avatar',
                    },
                    async (err, result) => {
                        if (err) {
                            return res.status(400).send(err);
                        }

                        newAccount.avatar = {};
                        newAccount.avatar.public_id = result.public_id;
                        newAccount.avatar.url = result.url;
                        await Account.findByIdAndUpdate(id, newAccount).then(
                            (data) => res.send(data),
                        );
                    },
                );
            } else {
                // return res.send(newAccount);
                await Account.findByIdAndUpdate(id, { $set: newAccount }).then(
                    (data) => res.send(data),
                );
            }
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    }
    async delete(req, res, next) {
        await Account.findByIdAndDelete(req.params.id)
            .then(() => res.send('Deleted successfully'))
            .catch((error) => next(new ApiError(404, 'Account not found')));
    }
}
module.exports = new Methods();
