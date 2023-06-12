import { defineStore } from 'pinia';
import videoService from '../services/video.service';
import { useAccountStore } from './account';
import accountService from '../services/account.service';
export const useVideoStore = defineStore('video', {
    state: () => ({
        inputSearch: '',
        videos: [],
        videosSearch: [],
        favoriteVideos: [],
    }),
    getters: {},
    actions: {
        updateInputSearch(input) {
            this.inputSearch = input;
        },
        resetInputSearch() {
            this.inputSearch = '';
        },
        async getAllVideos() {
            try {
                this.videos = await videoService.getAll();
            } catch (err) {
                console.log(err);
            }
        },
        async getOneVideo(videoId) {
            try {
                return await videoService.get(videoId);
            } catch (err) {
                console.log(err);
            }
        },
        checkInputSearch(video, input) {
            input = input.toLowerCase();
            const checkTags =
                video.tags &&
                video.tags.some((text) => text.toLowerCase().includes(input));
            const checkTitle =
                video.title && video.title.toLowerCase().includes(input);
            const checkChannelTitle =
                video.channelTitle &&
                video.channelTitle.toLowerCase().includes(input);
            const checkVideoId =
                video.videoId && video.videoId.toLowerCase().includes(input);
            return checkTags || checkTitle || checkChannelTitle || checkVideoId;
        },
        async getVideosSearch() {
            try {
                this.videosSearch = this.videos.filter((video) =>
                    this.checkInputSearch(video, this.inputSearch),
                );
            } catch (err) {
                console.log(err);
            }
            this.resetInputSearch();
        },
        async getFavoriteVideos() {
            const accountStore = useAccountStore();

            const myAccount = JSON.parse(
                JSON.stringify(
                    await accountService.get(accountStore.account._id),
                ),
            );
            this.favoriteVideos = myAccount.favoriteVideos.map(
                (video) => video,
            );
        },
        async refresh() {
            await this.getAllVideos();
            await this.getFavoriteVideos();
            await this.getVideosSearch();
        },
    },
});
