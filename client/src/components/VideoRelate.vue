<template>
    <div class="">
        <div v-for="video in videoRelative" :key="video._id" class="row">
            <VideoController
                :src="video.videoUpload.url"
                class="col-5 my-1 rounded-3"
                style="height: 120px"></VideoController>
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
                        {{ video.channelTitle }}
                    </p>
                    <div class="row mt-auto">
                        <p class="p-0 m-0 col-4">{{ video.viewCount }} views</p>
                        <p class="col-2">.</p>
                        <p class="p-0 m-0 col-6">{{ video.publishedAt }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import VideoController from './VideoController.vue';
import { useVideoStore } from '../store/video';
export default {
    setup() {
        const videoStore = useVideoStore();
        return { videoStore };
    },
    components: {
        VideoController,
    },
    data() {
        return {
            videoRelative: [],
        };
    },
    async mounted() {
        await this.videoStore.getAllVideos();
        this.videoRelative = this.videoStore.videos;
        console.log(
            '🚀 ~ file: VideoRelative.vue:23 ~ videoRelative:',
            this.videoRelative,
        );
    },
};
</script>

<style scoped></style>
