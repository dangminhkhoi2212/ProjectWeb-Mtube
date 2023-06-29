const mongoose = require('mongoose');
mongoose.set('debug', true);
const Schema = mongoose.Schema;
const siteService = require('../services/site');

const CommentSchame = new Schema(
    {
        videoId: { type: String, required: true },
        accountId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'Account',
        },

        textOriginal: { type: String, required: true, max: 3000 },
        publishedAt: { type: String, required: true },
    },
    {
        versionKey: false,
    },
);
module.exports = mongoose.model('Comment', CommentSchame);
