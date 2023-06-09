const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('debug', true);
const siteService = require('../services/site');

const VideoSchame = new Schema(
    {
        accountId: {
            type: Schema.Types.ObjectId,
            ref: 'Account',
        },
        publishedAt: { type: String, required: true },
        channelTitle: { type: String, required: true },
        title: { type: String, required: true, trim: true },
        videoUpload: {
            public_id: { type: String, required: true },
            url: { type: String, required: true },
        },
        description: {
            type: String,
            default: 'No description',
        },
        viewCount: { type: Number, default: 0 },
        image: { type: String },
        description: { type: String, trim: true },
        tags: [{ type: String, trim: true }],
        usersLike: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Account',
            },
        ],
        region: { type: String, required: true, default: 'VN' },
        category: { type: String },
        allowComment: { type: Boolean, default: true, required: true },
    },
    {
        versionKey: false,
    },
);
module.exports = mongoose.model('Video', VideoSchame);
