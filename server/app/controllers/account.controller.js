const Account = require('../models/Account.model');
const Video = require('../models/Video.model');
const Comment = require('../models/Comment.model');
const ApiError = require('../api.error');
const AccountModel = require('../models/Account.model');
const {
    uploadToCloudinary,
    deleteFile,
    deleteFolder,
} = require('../services/cloudinary.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { video } = require('../lib/cloudinary');
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
            var account = await Account.findById(req.params.id).populate({
                path: 'myVideos',
                populate: { path: 'accountId', select: 'avatar' },
            });
            delete account._doc.password;
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
            const result = await account.save();

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
            const { name, username, email, password } = req.body;
            const file = req.file;
            const account = await AccountModel.findById(id);

            if (name && !name.trim()) {
                return res
                    .status(400)
                    .json({ message: 'Name cannot be empty' });
            }

            if (
                (name || email) &&
                (account.username !== username || account.email !== email)
            ) {
                if (await methods.checkAccountExist(id, username, email)) {
                    return res
                        .status(400)
                        .send('Username or email already exists');
                }
            }

            if (file) {
                if (account.avatar.public_id)
                    await deleteFile(account.avatar.public_id);
                const result = await uploadToCloudinary(
                    file.path,
                    'image',
                    `accounts/${account._id}`,
                );

                account.avatar = {
                    public_id: result.public_id,
                    url: result.url,
                };
            } else if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                account.password = hashedPassword;
            }
            await account.save();

            return res.send(account);
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    }

    async deleteAccount(req, res, next) {
        try {
            const id = req.params.id;
            const password = req.body.password;

            var accountDelete = await Account.findById(id).populate('myVideos');

            const invalid = await bcrypt.compare(
                password,
                accountDelete.password,
            );
            if (invalid) {
                //Delete in cloundinary
                await deleteFile(accountDelete.avatar.public_id, 'image');
                var assetsArray = [];
                assetsArray = accountDelete.myVideos.map(
                    (video) => video.videoUpload.public_id,
                );

                assetsArray.forEach(async (asset) => {
                    await deleteFile(asset, 'video');
                });
                // wait for the files above to be completely deleted
                setTimeout(async () => {
                    await deleteFolder(`accounts/${id}`);
                }, 1000);

                //Delete in mongodb
                await Video.deleteMany({ accountId: id });
                await Comment.deleteMany({ accountId: id });
                accountDelete.myVideos.forEach(async (videoId) => {
                    await Comment.deleteOne({ videoId: videoId._id });
                });
                await Account.findOneAndDelete(id);

                res.send('Deleted successfully');
            } else next(new ApiError(400, 'Passwords do not match'));
        } catch (error) {
            next(new ApiError(500, error));
        }
    }
    async handleFollow(req, res, next) {
        try {
            const { accountIdA, accountIdB, status } = req.body;

            const isDifficult = accountIdA !== accountIdB;

            if (isDifficult) {
                var accountA = await Account.findById(accountIdA);
                var accountB = await Account.findById(accountIdB);

                const isFollowed = accountA.following.includes(accountIdB);

                if (status === 'follow' && !isFollowed) {
                    accountA.following.push(accountIdB);
                    accountB.followers.push(accountIdA);
                } else if (status === 'unfollow' && isFollowed) {
                    accountA.following = accountA.following.filter(
                        (id) => id.toString() !== accountIdB,
                    );
                    accountB.followers = accountB.followers.filter(
                        (id) => id.toString() !== accountIdA,
                    );
                }

                await accountA.save();
                await accountB.save();

                const result = await accountB.populate({
                    path: 'myVideos',
                    populate: { path: 'accountId', select: 'avatar' },
                });
                return res.send(result);
            }
            res.send("Can't follow yourself");
        } catch (error) {
            next(new ApiError(500, error));
        }
    }
    async editDetail(req, res, next) {
        try {
            const accountId = req.params.accountId;
            const { biography, media } = req.body;

            const result = await Account.findByIdAndUpdate(
                accountId,
                {
                    biography,
                    media,
                },
                { new: true },
            )
                .select('-password -token -username -email')
                .populate({
                    path: 'myVideos',
                    populate: { path: 'accountId', select: 'avatar' },
                });

            res.send(result);
        } catch (error) {
            next(new ApiError(500, error));
        }
    }
}
module.exports = new Methods();
