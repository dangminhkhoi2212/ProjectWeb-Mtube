const mongoose = require('mongoose');
mongoose.set('debug', true);
const Schema = mongoose.Schema;
const siteService = require('../services/site');

const CommentSchame = new Schema(
    {
        videoId: { type: String, required: true },
        accountId: { type: String, required: true },
        userName: { type: String, required: true },
        userImage: { type: String, required: true },
        textOriginal: { type: String, required: true },
        publishedAt: { type: String, required: true },
    },
    {
        versionKey: false,
    },
);
module.exports = mongoose.model('Comment', CommentSchame);
