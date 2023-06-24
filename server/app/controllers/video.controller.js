const VideoModel = require('../models/Video.model');
const CommentModel = require('../models/Comment.model');
const ApiError = require('../api.error');
const {
    uploadToCloudinary,
    deleteOldAvatar,
} = require('../services/cloudinary.service');
const AccountModel = require('../models/Account.model');

class Methods {
    async findAll(req, res, next) {
        await VideoModel.find({})
            .populate('accountId', 'avatar')
            .then((data) => {
                res.send(data);
            })
            .catch((error) =>
                next(
                    new ApiError(
                        500,
                        'An error occurent while retrieving contacts',
                    ),
                ),
            );
    }
    async create(req, res, next) {
        try {
            var data = req.body;
            var file = req.file;
            data.videoUpload = {};

            const { public_id, url } = await uploadToCloudinary(
                file.path,
                'video',
                `accounts/${data.accountId}/videosUpload`,
            );

            data.videoUpload.public_id = public_id;
            data.videoUpload.url = url;
            const newVideo = await VideoModel.create(data);

            const account = await AccountModel.findById(newVideo.accountId);
            account.myVideos.push(newVideo._id);
            await account.save();
            res.send(newVideo);
        } catch (error) {
            next(new ApiError(500, error.message));
        }
    }

    async deleteAll(req, res, next) {
        try {
            await VideoModel.deleteMany({});
            await CommentModel.deleteMany({});
            res.send('Deleted all videos and comments success');
        } catch (error) {
            next(
                new ApiError(
                    500,
                    'An error occurred while removing all videoModels',
                ),
            );
        }
    }
    async findOne(req, res, next) {
        try {
            const id = req.params.id;
            const result = await VideoModel.findById(id).populate(
                'accountId',
                'avatar',
            );
            res.send(result);
        } catch (error) {
            next(new ApiError(500, error.message));
        }
    }
    async update(req, res, next) {
        try {
            const dataUpdate = req.body;
            await VideoModel.findByIdAndUpdate(req.params.id, {
                $set: dataUpdate,
            });
            res.send('Updated successfully');
        } catch (error) {
            next(new ApiError(404, 'Music video not found'));
        }
    }

    async addView(req, res, next) {
        const id = req.params.id;
        try {
            const newVideoUpdate = await VideoModel.findById(id);
            newVideoUpdate.viewCount++;
            await newVideoUpdate.save().then((result) => res.send(result));
        } catch (err) {
            next(new ApiError(err.code || 500, err.message));
        }
    }
    async delete(req, res, next) {
        try {
            await VideoModel.deleteOne({ videoId: req.params.videoId });
            await CommentModel.deleteMany({ videoId: req.params.videoId });
            res.send(`Delete ${req.params.videoId} success`);
        } catch (error) {
            next(new ApiError(err.code || 500, err));
        }
    }

    async addUserLike(req, res, next) {
        const id = req.params.id;
        const videoId = req.params.videoId;
        try {
            const newVideoUpdate = await VideoModel.findById(videoId);
            const usersLike = newVideoUpdate.usersLike;
            var liked = false;
            for (let i = 0; i < usersLike.length; i++) {
                let userLiked = JSON.parse(JSON.stringify(usersLike[i]));
                if (userLiked === id) {
                    liked = true;
                    break;
                }
            }
            if (!liked) {
                newVideoUpdate.usersLike.push(id);
                newVideoUpdate.likeCount++;
            }
            await newVideoUpdate.save().then((result) => res.send(result));
        } catch (err) {
            next(new ApiError(err.code || 500, err));
        }
    }
    async removeUserLike(req, res, next) {
        const id = req.params.id;
        const videoId = req.params.videoId;
        try {
            const newVideoUpdate = await VideoModel.findById(videoId);
            const usersLike = newVideoUpdate.usersLike;
            var liked = false;
            for (let i = 0; i < usersLike.length; i++) {
                let userLiked = JSON.parse(JSON.stringify(usersLike[i]));
                if (userLiked === id) {
                    liked = true;
                    break;
                }
            }
            if (liked) {
                var index = usersLike.indexOf(id);
                if (index !== -1) {
                    newVideoUpdate.usersLike.splice(index, 1);
                }
                newVideoUpdate.likeCount--;
            }
            await newVideoUpdate.save().then((result) => res.send(result));
        } catch (err) {
            next(new ApiError('500', 'Dont remove userlike'));
        }
    }
}
module.exports = new Methods();
