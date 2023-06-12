const mongoose = require('mongoose');
mongoose.set('debug', true);
const Schema = mongoose.Schema;

const AccountSchame = new Schema(
    {
        name: { type: String, trim: true, required: true },
        username: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: true,
        },
        password: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        avatar: {
            public_id: { type: String, required: true },
            url: { type: String, required: true },
        },
        favoriteVideos: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Video',
            },
        ],
        myVideos: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Video',
            },
        ],
        token: { type: String },
    },
    {
        versionKey: false,
    },
);
module.exports = mongoose.model('Account', AccountSchame);
