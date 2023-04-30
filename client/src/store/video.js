import { defineStore } from 'pinia';
import videoService from '../services/video.service';
import { useAccountStore } from './account';
import accountService from '../services/account.service';
export const useVideoStore = defineStore('video', {
    state: () => ({
        inputSearch: '',
        videos: [],
        videosSearch: [],
        myVideos: [],
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
            return (
                video.tags.some((text) => text.toLowerCase().includes(input)) ||
                video.title.toLowerCase().includes(input) ||
                video.channelTitle.toLowerCase().includes(input) ||
                video.videoId.toLowerCase().includes(input)
            );
        },
        async getVideosSearch() {
            try {
                this.videosSearch = this.videos.filter((video) =>
                    this.checkInputSearch(video, this.inputSearch),
                );
            } catch (err) {
                alert("Don't find video!");
            }
            this.resetInputSearch();
        },
        async getMyVideos() {
            const accountStore = useAccountStore();

            const myAccount = JSON.parse(
                JSON.stringify(
                    await accountService.get(accountStore.account._id),
                ),
            );
            this.myVideos = myAccount.myVideos.map((video) => video);
        },
        async refresh() {
            await this.getAllVideos();
            await this.getMyVideos();
            await this.getVideosSearch();
        },
    },
});
