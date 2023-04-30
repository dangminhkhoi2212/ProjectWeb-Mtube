const express = require('express');
const cors = require('cors');
const app = express();
const accountRouter = require('./app/router/account.router');
const videoRouter = require('./app/router/video.router');
const commentRouter = require('./app/router/comment.router');
require('dotenv').config();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const path = require('path');
app.use('/account', accountRouter);
app.use('/video', videoRouter);
app.use('/comment', commentRouter);
// handle 404 response
app.use((rep, res, next) => {
    return next(new ApiError(404, 'Resource not found'));
});
app.use((err, req, res, next) => {
    return res.status(err.status || 500).json({
        message: err.message || 'Internal Sever Error',
    });
});
module.exports = app;
