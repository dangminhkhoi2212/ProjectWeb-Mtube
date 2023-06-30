<template>
    <section id="main vw-100" class="overflow-y">
        <div
            class="d-flex justify-content-between align-items-center py-2 sticky-top"
            style="
                z-index: 1 !important;
                background-color: var(--violet_100);
                border-top: 1px solid var(--border);
                border-bottom: 1px solid var(--border);
            ">
            <h4 class="ms-2">You have {{ videos.length }} videos</h4>
            <div class="fs-5">
                <span>Clear All</span>
                <i
                    class="fa-solid fa-trash btn-reacte rounded-4 mx-3"
                    @click="clearAll()">
                </i>
            </div>
        </div>
        <div class="container vl-parent" style="height: 80vh; overflow-y: auto">
            <VideoCard
                v-if="videos"
                :videos="videos"
                :option="option"
                :style="style"
                class="customArtplayer"
                @removeFavoriteVideo="removeFavoriteVideo"></VideoCard>
            <Loading
                v-model:active="loading.isLoading"
                :can-cancel="loading.onCancel"
                :is-full-page="loading.fullPage"
                :opacity="0.5"
                backgroundColor="#170f23 !important"
                color="#c6bcd3"
                loader="bars" />
        </div>
    </section>
</template>
<script>
import Header from '../components/Header.vue';
import Navigation from '../components/Navigation.vue';
import accountService from '../services/account.service';
import { useAccountStore } from '../store/account';
import { useVideoStore } from '../store/video';
import Artplayer from '../components/Artplayer.vue';
import VideoCard from '../components/VideoCard.vue';
import Loading from 'vue-loading-overlay';
import alertUtil from '../utils/myAlert';
import { convertISODate } from '../utils/date.utils';
export default {
    setup() {
        const accountStore = useAccountStore();
        const videoStore = useVideoStore();
        return { accountStore, videoStore };
    },
    components: {
        Navigation,
        Header,
        Artplayer,
        VideoCard,
        Loading,
    },
    data() {
        return {
            videos: [],
            option: {},
            style: {
                height: '180px',
                borderRadius: 'var(--border_radius_video)',
            },
            loading: {
                isLoading: false,
                fullPage: false,
                onCancel: false,
            },
        };
    },
    methods: {
        async getFavoriteVideos() {
            try {
                this.videos = await accountService.getFavoriteVideos(
                    this.accountStore.account._id,
                );
                this.videos = this.videos.map((video) => {
                    video.publishedAt = convertISODate(video.publishedAt);
                    return video;
                });
            } catch (error) {
                console.log(
                    '🚀 ~ file: FavoriteVideo.vue:50 ~ getFavoriteVideos ~ error:',
                    error,
                );
            }
        },
        async removeFavoriteVideo(videoId) {
            const confirm = await alertUtil.myConfirm(
                'Are you sure',
                'warning',
                'You want to remove this favorite video',
                'Yes, delete it!',
            );
            if (confirm) {
                try {
                    this.loading.isLoading = true;

                    this.videos = await accountService.removeFavoriteVideo(
                        this.accountStore.account._id,
                        videoId,
                    );

                    alertUtil.myAlert(
                        'success',
                        'Your video has been deleted.',
                    );
                    this.loading.isLoading = false;
                } catch (error) {
                    alertUtil.myAlert('Error!', "Don't delete this video! ");
                    this.loading.isLoading = false;
                }
            }
        },
        async clearAll() {
            const confirm = await alertUtil.myConfirm(
                'Are you sure?',
                'warning',
                'Delete all favorite videos ?',
                'Yes, delete it!',
            );
            if (confirm) {
                try {
                    this.loading.isLoading = true;

                    this.videos = await accountService.removeAllFavoriteVideos(
                        this.accountStore.account._id,
                    );

                    alertUtil.myAlert(
                        'success',
                        'All videos has been deleted.',
                    );
                    this.loading.isLoading = false;
                } catch (error) {
                    alertUtil.myAlert(
                        'error',
                        "Don't delete this all videos ! ",
                    );
                    this.loading.isLoading = false;
                }
            }
        },
    },
    computed: {},
    async mounted() {
        await this.getFavoriteVideos();
    },
};
</script>
<style scoped></style>
