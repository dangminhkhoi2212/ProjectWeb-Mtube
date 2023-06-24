const mongoose = require('mongoose');
mongoose.set('debug', true);
const Schema = mongoose.Schema;
const getToday = require('../utils/date.utils');

const AccountSchame = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            min: [0, ' Empty name!'],
            max: 30,
        },
        username: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: true,
            min: [0, ' Empty username!'],
            max: 15,
        },
        password: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        avatar: {
            public_id: { type: String },
            url: {
                type: String,
                default:
                    'https://res.cloudinary.com/dakwyskfm/image/upload/v1687403774/media_default/avatar_temp_r0uw3u.png',
            },
        },
        cover: {
            public_id: { type: String },
            url: {
                type: String,
                default:
                    'https://res.cloudinary.com/dakwyskfm/image/upload/v1687403746/media_default/sunset-2582656_1280_pgzvxg.jpg',
            },
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
        join: { type: String, default: getToday() },
        followers: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
        following: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
        biography: { type: String, max: 2000, default: '' },
        media: {
            facebook: { type: String, default: '#' },
            instagram: { type: String, default: '#' },
            tiktok: { type: String, default: '#' },
        },
        token: { type: String },
    },
    {
        versionKey: false,
    },
);
module.exports = mongoose.model('Account', AccountSchame);
