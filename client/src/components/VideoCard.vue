<template>
    <div class="mt-5 mt-sm-0 vl-parent overflow-auto" style="height: 80vh">
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
            v-if="this.myVideos"
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
        <!-- <hr v-show="this.inputSearch || this.myVideos" /> -->
        <div class="container-fluid row row-cols-md-3">
            <div
                class="card bg-transparent border-0"
                v-for="(video, index) in videosShow"
                :key="index">
                <router-link
                    style="text-decoration: none; color: inherit"
                    :to="{
                        name: 'detail',
                        params: {
                            id: video._id,
                        },
                    }">
                    <img
                        :src="video.image"
                        class="card-img-top rounded-4"
                        :alt="video.title" />
                    <div class="card-body">
                        <h5
                            class="card-title fs-5 text-truncate"
                            :alt="video.title">
                            &nbsp;
                            {{ video.title }}
                        </h5>
                        <p class="card-text fz-6">
                            <i class="fa-solid fa-house-fire"></i>&nbsp;
                            {{ video.channelTitle }}
                        </p>
                    </div>
                </router-link>
                <div class="card-footer text-center pb-5 border-0">
                    <div v-if="myVideos" class="fs-5">
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
export default {
    setup() {
        const videoStore = useVideoStore();
        const accountStore = useAccountStore();
        const extraStore = useExtraStore();
        return { videoStore, accountStore, extraStore };
    },
    props: {
        inputSearch: { type: String },
        myVideos: Boolean,
        region: { type: String },
    },
    components: {
        Loading,
    },
    data() {
        return {
            videos: [],
            message: '',
            isLoading: true,
            fullPage: false,
            onCancel: false,
            videosShow: [],
        };
    },
    methods: {
        async getAllVideos() {
            this.videoStore.updateInputSearch(this.inputSearch);
            if (this.myVideos) {
                //my videos
                await this.videoStore.getMyVideos();
                this.videos = this.videoStore.myVideos;
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
        if (!this.inputSearch) {
            if (this.region === 'VN')
                this.videosShow = this.videos.filter(
                    (video) => video.region === 'VN',
                );
            else if (this.region === 'US')
                this.videosShow = this.videos.filter(
                    (video) => video.region === 'US',
                );
            else
                this.videosShow = this.videos.filter(
                    (video) => video.region === 'KR',
                );
        } else this.videosShow = this.videos;
        console.log(this.videosShow);
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
