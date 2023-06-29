<template>
    <section class="vl-parent">
        <Carousel v-model="categoryActive"></Carousel>
        <div class="container px-1 px-lg-5" style="overflow-y: auto">
            <VideoCard
                class="customArtplayer"
                :videos="categoryVideos"
                :style="style"
                :option="option"></VideoCard>
        </div>
        <loading
            v-model:active="loading.isLoading"
            :can-cancel="false"
            backgroundColor="#170f23 !important"
            color="#c6bcd3"
            :opacity="0.6"
            loader="bars"
            :is-full-page="loading.fullPage" />
    </section>
</template>
<script>
import { useAccountStore } from '../store/account';
import { useVideoStore } from '../store/video';
import { convertISODate } from '../utils/date.utils';

import Carousel from '../components/Carousel.vue';

import videoService from '../services/video.service';
import VideoCard from '../components/VideoCard.vue';
import Artplayer from '../components/Artplayer.vue';

import Loading from 'vue-loading-overlay';
export default {
    setup() {
        const accountStore = useAccountStore();
        const videoStore = useVideoStore();
        return { accountStore, videoStore };
    },
    components: {
        Carousel,
        VideoCard,
        Artplayer,
        Loading,
    },

    data() {
        return {
            categoryActive: 'All',
            videos: [],
            categoryVideos: [],
            option: {},
            style: {
                width: '100%',
                height: '180px',
                borderRadius: 'var(--border_radius_video)',
            },
            loading: {
                isLoading: true,
                fullPage: false,
                onCancel: false,
            },
        };
    },
    watch: {
        categoryActive() {
            if (this.categoryActive !== 'All')
                this.categoryVideos = this.videos.filter(
                    (video) => video.category === this.categoryActive,
                );
            else this.categoryVideos = this.videos;
        },
    },
    methods: {
        async getAllVideos() {
            try {
                this.videos = JSON.parse(
                    JSON.stringify(await videoService.getAll()),
                );
            } catch (error) {
                console.log(
                    '🚀 ~ file: Home.vue:34 ~ methods:{getAllVideos ~ error:',
                    error,
                );
            }
        },
        formatDateVideo() {
            this.videos = this.videos.map((video) => {
                const time = convertISODate(video.publishedAt);
                return { ...video, publishedAt: time };
            });
        },
    },
    computed: {},
    async created() {
        this.loading.isLoading = true;
        await this.getAllVideos();
        this.formatDateVideo();

        this.categoryVideos = this.videos;
        this.loading.isLoading = false;
    },
};
</script>
<style scoped>
.active_link {
    background-color: var(--btn);
}
.art-video-player .art-mask {
    display: none !important;
}
</style>
