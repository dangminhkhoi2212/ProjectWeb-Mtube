const Account = require('../models/Account.model');
const Video = require('../models/Video.model');
const Comment = require('../models/Comment.model');
const ApiError = require('../api.error');
const AccountModel = require('../models/Account.model');
const {
    uploadToCloudinary,
    deleteFile,
    deleteFolder,
    createFolder,
} = require('../services/cloudinary.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { video } = require('../lib/cloudinary');
const { response } = require('express');
require('dotenv').config();

class Methods {
    async findAll(req, res, next) {
        var data = [];
        const searchCriteria = req.query.searchCriteria;

        try {
            if (searchCriteria) {
                data = await Account.find({
                    name: { $regex: `${searchCriteria}`, $options: 'i' },
                }).select('avatar name followers');
            } else {
                data = await Account.find({}).select('avatar name followers');
            }
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    'An error occurent while retrieving accounts',
                ),
            );
        }
        return res.send(data);
    }
    async getFavorite(req, res, next) {
        try {
            const id = req.params.id;
            const favoriteVideos = (
                await AccountModel.findById(id).populate({
                    path: 'favoriteVideos',
                    populate: { path: 'accountId', select: 'avatar' },
                })
            ).favoriteVideos;
            res.send(favoriteVideos);
        } catch (error) {
            next(new ApiError(error.status || 500, error.message));
        }
    }
    async checkAccountExist(id = null, username = null, email = null) {
        try {
            var check = [];
            if (username && email) {
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
            console.log(
                '🚀 ~ file: account.controller.js:68 ~ Methods ~ checkAccountExist ~ error:',
                error,
            );
        }
    }

    async createAccount(req, res, next) {
        try {
            const { username, email, password, name } = req.body;

            const accountExists = await Account.findOne({
                $or: [{ username }, { email }],
            });

            if (accountExists) {
                return next(
                    new ApiError(400, 'Username or email already exists'),
                );
            }

            if (name && !name.trim()) {
                return next(new ApiError(400, 'Name cannot be empty'));
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newAccount = {
                name,
                username,
                email,
                password: hashedPassword,
            };
            const createdAccount = await Account.create(newAccount);
            await createFolder(`accounts/${createdAccount._id}`);
            const file = req.file;
            if (file) {
                const result = await uploadToCloudinary(
                    file.path,
                    'image',
                    `accounts/${createdAccount._id}`,
                );

                createdAccount.avatar = {
                    public_id: result.public_id,
                    url: result.url,
                };
                await createdAccount.save();
            }
            res.send(createdAccount);
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
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
        try {
            var account = await Account.findById(req.params.id)
                .select('-password')
                .populate({
                    path: 'myVideos',
                    populate: { path: 'accountId', select: 'avatar' },
                });
            res.send(account);
        } catch (error) {
            next(new ApiError(404, error.message));
        }
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
            const result = await Account.findByIdAndUpdate(
                account._id,
                account,
            ).select('-password');

            return res.send(result);
        } catch (error) {
            next(new ApiError(500, error.message));
        }
    }
    async addFavoriteVideo(req, res, next) {
        try {
            const id = req.params.id;
            const videoId = req.params.videoId;

            const accountUpdate = await Account.findById(id);

            const exists = accountUpdate.favoriteVideos.includes(videoId);

            if (exists) {
                return res.send({
                    added: false,
                    message: 'Video already exists in favorites!',
                });
            } else {
                accountUpdate.favoriteVideos.push(videoId);
                await accountUpdate.save();
                return res.send({
                    added: true,
                    message: 'Added this video to favorites',
                });
            }
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    }
    async removeFavoriteVideo(req, res, next) {
        try {
            const id = req.params.id;
            const videoId = req.params.videoId;

            var accountUpdate = await Account.findById(id).populate(
                'favoriteVideos',
            );

            const index = accountUpdate.favoriteVideos.findIndex(
                (video) => JSON.parse(JSON.stringify(video._id)) === videoId,
            );

            if (index !== -1) {
                accountUpdate.favoriteVideos =
                    accountUpdate.favoriteVideos.filter(
                        (video, i) => i !== index,
                    );
            }

            await accountUpdate.save();
            accountUpdate = (
                await accountUpdate.populate({
                    path: 'favoriteVideos',
                    populate: { path: 'accountId', select: 'avatar' },
                })
            ).favoriteVideos;

            return res.send(accountUpdate);
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    }
    async removeAllFavoriteVideo(req, res, next) {
        try {
            const id = req.params.id;

            const accountUpdate = await Account.findById(id).populate(
                'favoriteVideos',
            );

            accountUpdate.favoriteVideos = [];

            await accountUpdate.save();
            return res.send(accountUpdate.favoriteVideos);
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    'An error occurred while deleting the videos',
                ),
            );
        }
    }
    async removeMyVideo(req, res, next) {
        try {
            const accountId = req.params.accountId;
            const videoId = req.params.videoId;

            //Delete video in field 'myVideos' of account
            var account = await Account.findById(accountId);
            account.myVideos = account.myVideos.filter(
                (video) => video.toString() !== videoId,
            );
            console.log(
                '🚀 ~ file: account.controller.js:263 ~ Methods ~ removeMyVideo ~ account.myVideos:',
                account.myVideos,
            );
            // return;
            const videoDelete = await Video.findById(videoId);
            //Delete video in cloundinary
            console.log(
                '🚀 ~ file: account.controller.js:269 ~ Methods ~ removeMyVideo ~ videoId:',
                videoDelete.videoUpload.public_id,
            );
            // return;
            await deleteFile(videoDelete.videoUpload.public_id, 'video');

            //Delete comments of video
            await Comment.deleteMany({ videoId: videoId });
            //Delete video in mongodb
            await Video.findByIdAndDelete(videoId);

            var result = await Account.findByIdAndUpdate(
                accountId,
                account,
            ).populate({
                path: 'myVideos',
                populate: { path: 'accountId', select: 'avatar' },
            });

            return res.send(result);
        } catch (error) {
            return next(new ApiError(500, error.message));
        }
    }

    async removeAllVideo(req, res, next) {
        try {
            const id = req.params.id;

            const accountUpdate = await Account.findById(id).populate(
                'favoriteVideos',
            );

            accountUpdate.favoriteVideos = [];

            await accountUpdate.save();
            return res.send(accountUpdate);
        } catch (error) {
            return next(
                new ApiError(
                    500,
                    'An error occurred while deleting the videos',
                ),
            );
        }
    }

    async updateAccount(req, res, next) {
        try {
            const id = req.params.id;
            const data = req.body;
            const file = req.file;
            const account = await AccountModel.findById(id);
            const methods = new Methods();
            const selectImage = req.body.selectImage;
            //handle name, username, email
            if (
                'name' in data && // check field existed in data
                'username' in data && // check field existed in data
                'email' in data && // check field existed in data
                !data.name &&
                !data.username &&
                !data.email
            ) {
                return res
                    .status(403)
                    .json({ message: "Name, username, email can't be empty" });
            }

            if (
                account.username !== data.username ||
                account.email !== data.email
            ) {
                if (
                    await methods.checkAccountExist(
                        id,
                        data.username,
                        data.email,
                    )
                ) {
                    return res
                        .status(403)
                        .json({ message: 'Username or email already exists' });
                }
            }
            //handle avatar and cover
            if (file) {
                const result = await uploadToCloudinary(
                    file.path,
                    'image',
                    `accounts/${account._id}`,
                );
                if (selectImage === 'avatar') {
                    if (account.avatar.public_id)
                        await deleteFile(account.avatar.public_id, 'image');
                    data.avatar = {};
                    data.avatar.public_id = result.public_id;
                    data.avatar.url = result.url;
                }
                if (selectImage === 'cover') {
                    if (account.cover.public_id)
                        await deleteFile(account.cover.public_id, 'image');
                    data.cover = {};
                    data.cover.public_id = result.public_id;
                    data.cover.url = result.url;
                }
            }
            //handle password
            if (data.password) {
                const checkPassword = await bcrypt.compare(
                    data.currentPassword,
                    account.password,
                );
                if (!checkPassword) {
                    next(new ApiError(403, 'Invalid current password'));
                }
                const hashedPassword = await bcrypt.hash(data.password, 10);
                data.password = hashedPassword;
            }

            const dataResult = await Account.findByIdAndUpdate(
                id,
                { $set: data },
                {
                    new: true,
                },
            )
                .select('-password')
                .populate({
                    path: 'myVideos',
                    populate: { path: 'accountId', select: 'avatar' },
                });

            return res.send(dataResult);
        } catch (error) {
            next(new ApiError(error.code, error));
        }
    }

    async deleteAccount(req, res, next) {
        try {
            const id = req.params.id;
            const password = req.body.password;

            const accountDelete = await Account.findById(id).populate(
                'myVideos',
            );

            const invalid = await bcrypt.compare(
                password,
                accountDelete.password,
            );

            if (invalid) {
                // Delete in cloudinary
                if (accountDelete.avatar.public_id)
                    await deleteFile(accountDelete.avatar.public_id, 'image');
                if (accountDelete.cover.public_id)
                    await deleteFile(accountDelete.cover.public_id, 'image');
                const assetsArray = accountDelete.myVideos.map(
                    (video) => video.videoUpload.public_id,
                );

                await Promise.all(
                    assetsArray.map((asset) => deleteFile(asset, 'video')),
                );

                // Wait for the files above to be completely deleted
                await deleteFolder(`accounts/${id}`);

                // Delete in MongoDB
                await Video.deleteMany({ accountId: id });
                await Comment.deleteMany({ accountId: id });

                await Promise.all(
                    accountDelete.myVideos.map((videoId) =>
                        Comment.deleteOne({ videoId: videoId._id }),
                    ),
                );

                await Account.findByIdAndDelete(id);

                res.send('Deleted successfully');
            } else {
                next(new ApiError(400, 'Passwords do not match'));
            }
        } catch (error) {
            next(new ApiError(500, error));
        }
    }

    async handleFollow(req, res, next) {
        try {
            const { accountIdA, accountIdB, status } = req.body;
            const isDifficult = accountIdA !== accountIdB;
            console.log(
                '🚀 ~ file: account.controller.js:470 ~ Methods ~ handleFollow ~  accountIdA !== accountIdB;:',
                accountIdA !== accountIdB,
                status,
            );
            var result1, result2;
            if (isDifficult) {
                if (status === 'follow') {
                    result1 = await Account.findByIdAndUpdate(
                        accountIdA,
                        {
                            $addToSet: {
                                following: accountIdB,
                            },
                        },
                        { new: true },
                    );
                    result2 = await Account.findByIdAndUpdate(
                        accountIdB,
                        {
                            $addToSet: {
                                followers: accountIdA,
                            },
                        },
                        { new: true },
                    );
                } else if (status === 'unfollow') {
                    result1 = await Account.findByIdAndUpdate(
                        accountIdA,
                        {
                            $pull: {
                                following: accountIdB,
                            },
                        },
                        { new: true },
                    );
                    result2 = await Account.findByIdAndUpdate(
                        accountIdB,
                        {
                            $pull: {
                                followers: accountIdA,
                            },
                        },
                        { new: true },
                    );
                }

                return res.send(result2);
            }
            res.send("Can't follow yourself");
        } catch (error) {
            next(new ApiError(500, error));
        }
    }
}
module.exports = new Methods();
