const Account = require('../models/Account.model');
const ApiError = require('../api.error');
const AccountModel = require('../models/Account.model');
const cloudinary = require('cloudinary').v2;

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
    async create(req, res, next) {
        var data = { ...req.body };
        if (!data.name.trim()) {
            return next(new ApiError(400, 'Name can not be empty'));
        }
        const file = req.file;
        if (!file) {
            const error = new Error('Please upload a file');
            error.httpStatusCode = 400;
            return next(error);
        }
        await Account.create({
            name: data.name,
            username: data.username,
            password: data.password,
            email: data.email,
            image: file.path,
            myVideos: data.myVideos,
        })
            .then((data) => res.send(data))
            .catch((error) => {
                return next(
                    new ApiError(
                        500,
                        'An error occurred while creating the accounts',
                    ),
                );
            });
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
            .populate('myVideos')
            .then((data) => res.send(data))
            .catch((error) => next(new ApiError(404, 'Account not found')));
    }
    async findOneAccount(req, res, next) {
        const data = req.body;
        await Account.findOne({
            username: data.username,
            password: data.password,
        })
            .populate('myVideos')
            .then((data) => res.send(data))
            .catch((error) => {
                next(new ApiError(404, 'Account not found'));
            });
    }
    async addVideo(req, res, next) {
        const id = req.params.id;
        const videoId = req.params.videoId;
        var accountUpdate = await Account.findById(id)
            .then((data) => data)
            .catch((err) => console.log(err));
        var exist = 0;
        accountUpdate.myVideos.forEach((idExist) => {
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
            accountUpdate.myVideos.push(videoId);
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
            .populate('myVideos')
            .then((data) => data)
            .catch((err) => console.log(err));
        var index = -1;
        accountUpdate.myVideos.forEach((video, i) => {
            if (JSON.parse(JSON.stringify(video._id)) === videoId) {
                index = i;
            }
        });
        if (index !== -1) {
            accountUpdate.myVideos.splice(index, 1);
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
            .populate('myVideos')
            .then((data) => data)
            .catch((err) => console.log(err));
        accountUpdate.myVideos = [];
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
        var id = req.params.id;
        var data = req.body;
        var newAccount = { ...data };
        var oldAccount = await AccountModel.findById(id).then(
            (result) => result,
        );
        var index = oldAccount.image.lastIndexOf('/');
        var oldImg = oldAccount.image.slice(index + 1);
        index = oldImg.indexOf('.');
        oldImg = 'account_avatar/' + oldImg.slice(0, index);

        const file = req.file;
        if (!data.name.trim()) {
            return next(new ApiError(400, 'Name can not be empty'));
        }

        if (file) {
            cloudinary.uploader.destroy(oldImg); // delete old image at uploads folder
            newAccount.image = file.path;
        }
        await Account.findByIdAndUpdate(id, { $set: newAccount })
            .then((data) => res.send(data))
            .catch((error) => {
                return next(
                    new ApiError(
                        500,
                        'An error occurred while creating the accounts',
                    ),
                );
            });
    }
    async delete(req, res, next) {
        await Account.findByIdAndDelete(req.params.id)
            .then(() => res.send('Deleted successfully'))
            .catch((error) => next(new ApiError(404, 'Account not found')));
    }
}
module.exports = new Methods();
