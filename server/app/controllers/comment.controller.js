const Comment = require('../models/Comment.model');
const ApiError = require('../api.error');
const commentApiYoutobe = require('../services/commentApiYoutube');
const videoApiYoutube = require('../services/videoApiYoutube');
const CommentModel = require('../models/Comment.model');
class Methods {
    async findAll(req, res, next) {
        await Comment.find({ videoId: req.params.videoId })
            .then((data) => {
                res.send(data);
            })
            .catch((error) =>
                next(
                    new ApiError(
                        500,
                        'An error occurent while retrieving comments',
                    ),
                ),
            );
    }
    async create(req, res, next) {
        var data = req.body;
        // if (!data.userId || !data.userName) {
        //     return next(new ApiError(400, 'Name can not be empty'));
        // }
        await Comment.create(data)
            .then((data) => res.send(data))
            .catch((error) => {
                return next(
                    new ApiError(
                        500,
                        'An error occurred while creating the comments',
                    ),
                );
            });
    }
    async createWithApi(req, res, next) {
        const listId = await videoApiYoutube.getListId();
        const dataArray = [];
        try {
            listId.forEach(async (videoId) => {
                const data = await commentApiYoutobe.getApiCommnets(videoId);
                data.forEach(async (cmt) => await Comment.create(cmt));
                dataArray.push(data);
            });
        } catch (err) {
            next(ApiError(500, 'Error while create comments with api.'));
        }

        res.send(dataArray);
    }
    async deleteAll(req, res, next) {
        await Comment.deleteMany({})
            .then((result) =>
                res.send(
                    `${result.deletedCount} comments were deleted successfully`,
                ),
            )
            .catch((error) =>
                next(
                    new ApiError(
                        500,
                        'An error occurred while removing all comments',
                    ),
                ),
            );
    }
    async findOne(req, res, next) {
        await Comment.findById(req.params.id)
            .then((data) => res.send(data))
            .catch((error) => next(new ApiError(404, 'Comment not found')));
    }
    async update(req, res, next) {
        var dataUpdate = req.body;
        await Comment.findByIdAndUpdate(req.params.id, {
            $set: dataUpdate,
        })
            .then(() => res.send('Updated successfully'))
            .catch((error) => next(new ApiError(404, 'Comment not found')));
    }
    async delete(req, res, next) {
        await Comment.findByIdAndDelete(req.params.id)
            .then(() => res.send('Deleted comment successfully'))
            .catch((error) => next(new ApiError(404, "Can't delete comment")));
    }
}
module.exports = new Methods();
