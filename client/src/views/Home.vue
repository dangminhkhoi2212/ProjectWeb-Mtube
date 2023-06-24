<template>
    <section id="main">
        <Carousel v-model="categoryActive"></Carousel>
        <div
            class="container px-1 px-lg-5"
            style="height: 82vh; overflow-y: auto">
            <VideoCard
                class="customArtplayer"
                :videos="categoryVideos"
                :style="style"
                :option="option"></VideoCard>
        </div>
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
        };
    },
    watch: {
        categoryActive() {
            if (this.categoryActive !== 'All')
                this.categoryVideos = this.videos.filter(
                    (video) => video.category === this.categoryActive,
                );
            else this.categoryVideos = this.videos;
            console.log(
                '🚀 ~ file: Home.vue:53 ~ mounted ~ this.videos:',
                this.categoryVideos,
            );
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
    },
    computed: {},
    async mounted() {
        await this.getAllVideos();

        this.videos = this.videos.map((video) => {
            const time = convertISODate(video.publishedAt);
            return { ...video, publishedAt: time };
        });
        this.categoryVideos = this.videos;
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
