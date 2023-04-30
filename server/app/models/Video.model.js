const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('debug', true);
const siteService = require('../services/site');

const VideoSchame = new Schema(
    {
        videoId: { type: String, require: true },
        publishedAt: { type: String, require: true },
        channelTitle: { type: String, require: true },
        title: { type: String, require: true },
        url: { type: String, require: true },
        description: { type: String, require: true },
        likeCount: { type: Number, require: true },
        viewCount: { type: Number, require: true },
        image: { type: String, require: true },
        description: { type: String, require: true },
        tags: { type: Array, require: true },
        usersLike: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Account',
            },
        ],
        region: { type: String, require: true },
    },
    {
        versionKey: false,
    },
);
module.exports = mongoose.model('Video', VideoSchame);
