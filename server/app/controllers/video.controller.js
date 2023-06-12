const VideoModel = require('../models/Video.model');
const CommentModel = require('../models/Comment.model');
const ApiError = require('../api.error');
const videoApiYoutube = require('../services/videoApiYoutube');
const commentApiYoutobe = require('../services/commentApiYoutube');
const cloudinary = require('../lib/cloudinary');
class Methods {
    async findAll(req, res, next) {
        await VideoModel.find({})
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
        var data = req.body;
        var file = req.file;
        data.videoUpload = {};
        cloudinary.uploader.upload(
            file.path,
            {
                resource_type: 'video',
                folder: `upload_videos/${data.accountId}`,
            },
            async (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).send(err);
                }
                // return res.send(result);
                data.videoUpload.public_id = result.public_id;
                data.videoUpload.url = result.url;
                await VideoModel.create(data)
                    .then((data) => res.send(data))
                    .catch((error) => {
                        return next(
                            new ApiError(error.code || 500, error.message),
                        );
                    });
            },
        );
    }
    async createWithApi(req, res, next) {
        //*********** Create data with apiYoutube ********
        try {
            const data = await videoApiYoutube.getApiVideos();
            data.forEach(async (vi) => {
                await VideoModel.create(vi);
                var comments = await commentApiYoutobe.getApiCommnets(
                    vi.videoId,
                );
                comments.forEach(async (cmt) => await CommentModel.create(cmt));
            });
            res.send('Create videos and comments success');
        } catch (err) {
            return next(new ApiError(500, "Don't create videos and comments"));
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
        await VideoModel.findById(req.params.id)
            .then((data) => res.send(data))
            .catch((error) => next(new ApiError(404, 'Music video not found')));
    }
    async update(req, res, next) {
        var dataUpdate = req.body;
        await VideoModel.findByIdAndUpdate(req.params.id, {
            $set: dataUpdate,
        })
            .then(() => res.send('Updated successfully'))
            .catch((error) => next(new ApiError(404, 'Music video not found')));
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
    async searchVideo(req, res, next) {
        var q = req.params.q;
        try {
            var data = await videoApiYoutube.searchVideo(q);
            res.send(data);
        } catch (err) {
            next(new ApiError('500', 'Video not found'));
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
