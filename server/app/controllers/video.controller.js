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
        try {
            const searchCriteria = req.query.searchCriteria;
            console.log(
                '🚀 ~ file: video.controller.js:14 ~ Methods ~ findAll ~ searchCriteria:',
                searchCriteria,
            );
            var result = [];
            var option = {
                path: 'accountId',
                select: ['avatar', 'name'],
            };
            if (searchCriteria) {
                result = await VideoModel.find({
                    $or: [
                        {
                            channelTitle: {
                                $regex: searchCriteria,
                                $options: 'i',
                            },
                        },
                        { title: { $regex: searchCriteria, $options: 'i' } },
                        { tags: { $regex: searchCriteria, $options: 'i' } },
                        { category: { $regex: searchCriteria, $options: 'i' } },
                    ],
                }).populate(option);
            } else result = await VideoModel.find().populate(option);
            res.send(result);
        } catch (error) {
            next(new ApiError(500, error.message));
        }
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
            const id = req.params.videoId;
            const result = await VideoModel.findById(id).populate({
                path: 'accountId',
                select: ['name', 'avatar', 'followers'],
            });
            res.send(result);
        } catch (error) {
            next(new ApiError(500, error.message));
        }
    }
    async update(req, res, next) {
        try {
            const videoId = req.params.videoId;

            const data = req.body;
            console.log(
                '🚀 ~ file: video.controller.js:100 ~ Methods ~ update ~ data:',
                data,
                videoId,
            );
            var result = {};
            const options = {
                path: 'accountId',
                select: ['name', 'avatar', 'followers'],
            };
            if ('like' in data) {
                if (data.like === true)
                    result = await VideoModel.findByIdAndUpdate(
                        videoId,
                        {
                            $addToSet: { usersLike: data.accountId },
                        },
                        { new: true },
                    ).populate(options);
                else
                    result = await VideoModel.findByIdAndUpdate(
                        videoId,
                        {
                            $pull: { usersLike: data.accountId },
                        },
                        { new: true },
                    ).populate(options);
            } else {
                result = await VideoModel.findByIdAndUpdate(
                    videoId,
                    {
                        $set: data,
                    },
                    { new: true },
                ).populate('accountId', ['avatar', 'name', 'followers']);
            }
            res.send(result);
        } catch (error) {
            next(new ApiError(404, error.message));
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
}
module.exports = new Methods();
