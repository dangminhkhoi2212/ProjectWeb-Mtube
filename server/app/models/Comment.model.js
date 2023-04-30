const mongoose = require('mongoose');
mongoose.set('debug', true);
const Schema = mongoose.Schema;
const siteService = require('../services/site');

const CommentSchame = new Schema(
    {
        videoId: { type: String, require: true },
        userId: { type: String, require: true },
        userName: { type: String, require: true },
        userImage: { type: String, require: true },
        textOriginal: { type: String, require: true },
        publishedAt: { type: String, require: true },
    },
    {
        versionKey: false,
    },
);
module.exports = mongoose.model('Comment', CommentSchame);
