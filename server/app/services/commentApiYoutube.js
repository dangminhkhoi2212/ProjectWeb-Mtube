const videoApiYoutube = require('./videoApiYoutube');
const moment = require('moment');
class apiYoutube {
    create(data) {
        var comment = {
            videoId: data.snippet.videoId,
            userId: data.snippet.topLevelComment.id,
            userName: data.snippet.topLevelComment.snippet.authorDisplayName,
            userImage:
                data.snippet.topLevelComment.snippet.authorProfileImageUrl,
            textOriginal: data.snippet.topLevelComment.snippet.textOriginal,
            publishedAt: moment(
                data.snippet.topLevelComment.snippet.publishedAt,
            )
                .utc()
                .format('MM/DD/YYYY'),
        };
        return comment;
    }
    async getApiCommnets(videoId) {
        const keyapi = 'AIzaSyB-zjA674ChcYoSDn06IEKFFsA4m9I-bvU';
        const comment_http =
            'https://youtube.googleapis.com/youtube/v3/commentThreads?';
        const data = await fetch(
            comment_http +
                new URLSearchParams({
                    key: keyapi,
                    part: 'snippet',
                    maxResults: 40,
                    videoId: videoId,
                }),
        )
            .then((res) => res.json())
            .catch((err) => console.log(err));
        // get items of data from api
        var commentApi;
        if (!data || !data.items) commentApi = [];
        else
            commentApi = Object.keys(data.items).map(
                (index) => data.items[index],
            );

        // console.log(commentApi);
        // create object to push array
        var comments = [];
        commentApi.forEach((cmt) => {
            let comment = this.create(cmt);
            comments.push(comment);
        });
        return comments;
        // return commentApi;
    }
}
module.exports = new apiYoutube();
