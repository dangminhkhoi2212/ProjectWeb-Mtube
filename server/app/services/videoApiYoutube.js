const moment = require('moment');
class apiYoutube {
    create(data) {
        var video = {
            videoId: data.id,
            channelTitle: data.snippet.channelTitle,
            url: data.snippet.thumbnails.standard.url,
            title: data.snippet.title,
            likeCount: data.statistics.likeCount,
            viewCount: data.statistics.viewCount,
            image: data.snippet.thumbnails.standard.url,
            description: data.snippet.description,
            tags: data.snippet.tags,
            publishedAt: moment(data.snippet.publishedAt)
                .utc()
                .format('MM/DD/YYYY'),
            region: 'CN',
        };
        return video;
    }
    async getApiVideos() {
        const keyapi = 'AIzaSyB-zjA674ChcYoSDn06IEKFFsA4m9I-bvU';
        const video_http = 'https://www.googleapis.com/youtube/v3/videos?';
        const data = await fetch(
            video_http +
                new URLSearchParams({
                    key: keyapi,
                    part: ['snippet', 'statistics'],
                    chart: 'mostPopular',
                    maxResults: 45,
                    regionCode: 'CN',
                }),
        )
            .then((res) => res.json())
            .catch((err) => console.log(err));

        var videoApi;
        if (!data || !data.items) videoApi = [];
        else
            videoApi = Object.keys(data.items).map(
                (index) => data.items[index],
            );
        const videos = [];
        videoApi.forEach((vi) => {
            let video = this.create(vi);
            videos.push(video);
        });
        this.getListId(videos);
        return videos;
    }
    async getListId() {
        var listID = [];
        var data = await this.getApiVideos();
        data.forEach((video) => {
            listID.push(video.videoId);
        });
        return listID;
    }
}
module.exports = new apiYoutube();
