<template>
    <section id="main">
        <div class="px-5">
            <VideoCard
                v-if="videos"
                :key="this.$route.params.textSearch"
                :videos="videos"
                :option="option"
                :style="style"
                class="customArtplayer"></VideoCard>
        </div>
    </section>
</template>
<script>
import VideoCard from '../components/VideoCard.vue';
import videoService from '../services/video.service';
import accountService from '../services/account.service';
import { useAccountStore } from '../store/account';
import { convertISOTime } from '../utils/date.utils';
export default {
    setup() {
        const accountStore = useAccountStore();
        return { accountStore };
    },
    props: {
        textSearch: '',
    },
    components: {
        VideoCard,
    },
    data() {
        return {
            Account: this.accountStore.account,
            videos: [],
            option: {},
            style: {
                width: '100%',
                height: '180px',
                borderRadius: 'var(--border_radius_video)',
            },
        };
    },
    methods: {
        getvalue(route) {
            return route.params.textSearch;
        },
        async getAllVideos() {
            try {
                const data = await videoService.getAll();

                data.forEach((video) => {
                    if (this.checkInputSearch(video, this.textSearch)) {
                        const temp = convertISOTime(video.publishedAt);
                        var result = {
                            ...video,
                            publishedAt: temp,
                        };
                        this.videos.push(result);
                    }
                });
            } catch (error) {
                console.log(
                    '🚀 ~ file: Search.vue:44 ~ getAllVideos ~ error:',
                    error,
                );
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
    },
    computed: {},
    async mounted() {
        await this.getAllVideos();
        console.log(
            '🚀 ~ file: Search.vue:70 ~ mounted ~ textSearch:',
            this.textSearch,
        );
    },
};
</script>
<style scoped></style>
