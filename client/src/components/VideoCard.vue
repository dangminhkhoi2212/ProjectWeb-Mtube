<template>
    <div
        class="container mt-5 mt-sm-0 vl-parent overflow-auto w-100"
        :style="isHomePage || isFavoriteVideo ? 'height:82vh' : ''">
        <div
            v-if="this.inputSearch"
            class="d-flex justify-content-between align-items-center py-2 sticky-top zindex-sticky"
            style="
                z-index: 1 !important;
                background-color: var(--violet_100);
                border-top: 1px solid var(--border);
                border-bottom: 1px solid var(--border);
            ">
            <h4 class="ms-2">
                Search result : {{ this.videos.length }} videos
            </h4>
        </div>
        <div
            v-if="isFavoriteVideo"
            class="d-flex justify-content-between align-items-center py-2 sticky-top"
            style="
                z-index: 1 !important;
                background-color: var(--violet_100);
                border-top: 1px solid var(--border);
                border-bottom: 1px solid var(--border);
            ">
            <h4 class="ms-2">You have {{ this.videos.length }} videos</h4>
            <div class="fs-5">
                <span>Clear All</span>
                <i
                    class="fa-solid fa-trash btn-reacte rounded-4 mx-3"
                    @click="clearAll()">
                </i>
            </div>
        </div>
        <div
            class="row pt-3"
            :class="isHomePage ? 'row-cols-md-3' : 'row-cols-1'">
            <div
                class="row align-items-center"
                v-for="(video, index) in videosShow"
                :key="index">
                <router-link
                    style="text-decoration: none; color: inherit"
                    :to="{
                        name: 'detail',
                        params: {
                            id: video._id,
                            accountId: video.accountId,
                        },
                    }"
                    class="row col-11">
                    <!-- <VideoController
                        :src="video.videoUpload.url"
                        class="card-video-top rounded-3 my-1"
                        :class="isHomePage ? 'col-12' : 'col-5'"
                        :alt="video.title"
                        :style="
                            isHomePage ||
                            this.$route.name === 'search' ||
                            this.$route.name === 'favorite'
                                ? 'height: 12rem'
                                : 'height:120px'
                        " /> -->
                    <Artplayer
                        class="card-video-top rounded-3 my-1"
                        :class="
                            isHomePage ||
                            this.$route.name === 'search' ||
                            this.$route.name === 'favorite'
                                ? 'col-12'
                                : 'col-5'
                        "
                        :alt="video.title"
                        v-if="video.videoUpload.url"
                        :option="{ ...option, url: video.videoUpload.url }"
                        :style="style" />
                    <div class="col-7">
                        <p
                            class="my-1 w-100"
                            style="
                                overflow: hidden;
                                text-overflow: ellipsis;
                                display: -webkit-box;
                                -webkit-line-clamp: 2;
                                -webkit-box-orient: vertical;
                            ">
                            {{ video.title }}
                        </p>
                        <div
                            class="font-weight-lighter"
                            style="
                                color: var(--text_white_50);
                                font-size: 0.8rem;
                                font-weight: 300;
                            ">
                            <p class="p-0 m-0">
                                <RouterLink
                                    :to="{
                                        name: 'profile',
                                        params: {
                                            accountId: video.accountId,
                                        },
                                    }">
                                    {{ video.channelTitle }}
                                </RouterLink>
                            </p>
                            <div class="row mt-auto">
                                <p
                                    class="p-0 m-0"
                                    :class="
                                        isFavoriteVideo ? 'col-3' : 'col-6'
                                    ">
                                    {{ video.viewCount + ' views' }}
                                </p>
                                <span class="p-0 m-0 col-1">•</span>
                                <p class="p-0 m-0 col-5">
                                    {{ video.publishedAt }}
                                </p>
                            </div>
                        </div>
                    </div>
                </router-link>
                <div
                    v-if="isFavoriteVideo"
                    class="text-center pb-5 border-0 col-1">
                    <div class="fs-5">
                        <i
                            class="fa-solid fa-trash btn-reacte rounded-4"
                            @click="removeVideo(video._id)"></i>
                    </div>
                </div>
            </div>
        </div>
        <loading
            v-model:active="isLoading"
            :can-cancel="false"
            backgroundColor="#170f23 !important"
            color="#c6bcd3"
            :opacity="1"
            loader="bars"
            :is-full-page="fullPage" />
    </div>
</template>
<script>
import VideoService from '../services/video.service';
import { RouterLink } from 'vue-router';
import { useVideoStore } from '../store/video';
import { useAccountStore } from '../store/account';
import accountService from '../services/account.service';
import videoService from '../services/video.service';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import Swal from 'sweetalert2';
import { useExtraStore } from '../store/extra';
import VideoController from './VideoController.vue';
import Artplayer from './Artplayer.vue';

export default {
    setup() {
        const videoStore = useVideoStore();
        const accountStore = useAccountStore();
        const extraStore = useExtraStore();
        return { videoStore, accountStore, extraStore };
    },
    props: {
        inputSearch: { type: String },
        category: { type: String },
        videoIdCurrent: { type: String },
    },
    components: {
        Loading,
        VideoController,
        Artplayer,
    },
    data() {
        return {
            videos: [],
            message: '',
            isLoading: true,
            fullPage: false,
            onCancel: false,
            videosShow: [],
            isFavoriteVideo: this.$route.name === 'favorite',
            isHomePage: this.$route.name === 'home',
            option: { showController: false },
            style: {
                width: '100%',
                height: '180px',
                borderRadius: '10px',
            },
        };
    },
    methods: {
        async getAllVideos() {
            this.videoStore.updateInputSearch(this.inputSearch);
            if (this.isFavoriteVideo) {
                //favoriteVideos
                await this.videoStore.getFavoriteVideos();
                this.videos = this.videoStore.favoriteVideos;
            } else if (!this.inputSearch) {
                // home
                await this.videoStore.getAllVideos();
                this.videos = this.videoStore.videos;
            } else {
                //search
                await this.videoStore.getVideosSearch();
                this.videos = this.videoStore.videosSearch;
            }
        },
        async removeVideo(id) {
            const confirm = await this.extraStore.myConfirm(
                'Are you sure?',
                'warning',
                "You won't be able to revert this!",
                'Yes, delete it!',
            );
            if (confirm) {
                try {
                    this.isLoading = true;
                    var temp = await accountService.removeVideo(
                        this.accountStore.account._id,
                        id,
                    );
                    this.videos = temp.myVideos;
                    this.videosShow = this.videos;
                    this.isLoading = false;
                    this.extraStore.myAlert(
                        'success',
                        'Your video has been deleted.',
                    );
                } catch (err) {
                    this.isLoading = false;
                    this.extraStore.myAlert(
                        'Error!',
                        "Don't delete this video! ",
                    );
                }
            }
        },
        async clearAll() {
            const confirm = await this.extraStore.myConfirm(
                'Are you sure?',
                'warning',
                'You really want delete all my videos that you seved ? 🥺',
                'Yes, delete it!',
            );
            if (confirm) {
                try {
                    if (!this.videos.length) {
                        this.extraStore.myAlert(
                            'warning',
                            "Your 'My video' emtpy!",
                        );
                        return;
                    }
                    await accountService.removeAllVideo(
                        this.accountStore.account._id,
                    );
                    this.videos = [];
                    this.videosShow = [];
                    this.isLoading = false;

                    // await this.accountStore.refresh();
                    this.extraStore.myAlert(
                        'success',
                        'Your all videos has been deleted.',
                    );
                } catch (err) {
                    this.isLoading = false;
                    this.extraStore.myAlert(
                        'error',
                        "Don't delete all videos!",
                    );
                }
            }
        },
    },
    computed: {},
    async mounted() {
        await this.getAllVideos();
        if (this.$route.name === 'home') {
            if (this.category === 'All') this.videosShow = this.videos;
            else
                this.videosShow = this.videos.filter(
                    (video) => video.category === this.category,
                );
        } else if (this.$route.name === 'detail') {
            this.videosShow = this.videos.filter(
                (video) =>
                    video.category === this.category &&
                    video._id !== this.videoIdCurrent,
            );
        } else this.videosShow = this.videos;
        console.log(
            '🚀 ~ file: VideoCard.vue:289 ~ mounted ~ this.videosShow:',
            this.videosShow,
        );
        this.isLoading = false;
    },
};
</script>
<style scoped>
html {
    font-size: 16px;
    text-decoration: none;
}
</style>
