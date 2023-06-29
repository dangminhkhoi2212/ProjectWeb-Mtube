const ApiError = require('../api.error');
const CommentModel = require('../models/Comment.model');
const VideoModel = require('../models/Video.model');
class Methods {
    async findAll(req, res, next) {
        try {
            const data = await CommentModel.find({
                videoId: req.params.videoId,
            }).populate('accountId', ['avatar', 'name', 'followers']);
            res.send(data);
        } catch (error) {
            next(
                new ApiError(
                    500,
                    'An error occurred while retrieving comments',
                ),
            );
        }
    }

    async create(req, res, next) {
        try {
            const data = req.body;
            const video = await VideoModel.findById(data.videoId);
            if (!video.allowComment) {
                res.status(500).json({
                    message: 'This video blocked comment!',
                });
                return;
            }
            const createdComment = await CommentModel.create(data);
            res.send(createdComment);
        } catch (error) {
            next(
                new ApiError(
                    500,
                    'An error occurred while creating the comments',
                ),
            );
        }
    }

    async deleteAll(req, res, next) {
        try {
            const result = await CommentModel.deleteMany({});
            res.send(
                `${result.deletedCount} comments were deleted successfully`,
            );
        } catch (error) {
            next(
                new ApiError(
                    500,
                    'An error occurred while removing all comments',
                ),
            );
        }
    }

    async findOne(req, res, next) {
        try {
            const comment = await CommentModel.findById(req.params.id);
            if (comment) {
                res.send(comment);
            } else {
                next(new ApiError(404, 'Comment not found'));
            }
        } catch (error) {
            next(
                new ApiError(
                    500,
                    'An error occurred while retrieving the comment',
                ),
            );
        }
    }

    async update(req, res, next) {
        try {
            const dataUpdate = req.body;
            await CommentModel.findByIdAndUpdate(req.params.id, {
                $set: dataUpdate,
            });
            res.send('Updated successfully');
        } catch (error) {
            next(new ApiError(404, 'Comment not found'));
        }
    }

    async delete(req, res, next) {
        try {
            await CommentModel.findByIdAndDelete(req.params.id);
            res.send('Deleted comment successfully');
        } catch (error) {
            next(new ApiError(404, "Can't delete comment"));
        }
    }
}
module.exports = new Methods();
