const mongoose = require('mongoose');
mongoose.set('debug', true);
const Schema = mongoose.Schema;

const AccountSchame = new Schema(
    {
        name: { type: String, require: true },
        username: { type: String, require: true },
        password: { type: String, require: true },
        email: { type: String, require: true },
        image: { type: String, require: true },
        myVideos: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Video',
            },
        ],
    },
    {
        versionKey: false,
    },
);
module.exports = mongoose.model('Account', AccountSchame);
