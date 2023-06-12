<template>
    <div class="row mt-5 mt-md-0 text-break vl-parent px-lg-5">
        <div class="col-12 col-xl-8">
            <!-- <VideoController
                id="video"
                class="mt-5 mt-sm-0 w-100"
                style=""
                :src="urlVideo"
                :autoplay="false"
                :controls="true"></VideoController> -->
            <Artplayer v-if="urlVideo" :option="option" :style="style" />
            <div class="">
                <p class="p-0 fs-4">
                    {{ video.title }}
                </p>
                <hr />
                <div class="">
                    <p class="fs-3">
                        <RouterLink
                            v-if="video.accountId"
                            :to="{
                                name: 'profile',
                                params: {
                                    accountId: video.accountId,
                                },
                            }">
                            <img
                                :src="avatarChannel"
                                alt=""
                                style="
                                    width: 48px;
                                    height: 48px;
                                    object-fit: cover;
                                "
                                class="rounded-5 col-1 mx-3" />&nbsp;
                            {{ video.channelTitle }}</RouterLink
                        >
                    </p>

                    <div
                        class="w-100 d-flex justify-content-around align-items-center my-4 gap-2 text-center">
                        <div class="fs-5">
                            <i class="fa-solid fa-eye btn-reacte rounded-4"></i
                            >&nbsp;
                            <span>{{ video.viewCount }}</span>
                        </div>
                        <div class="fs-5">
                            <i
                                class="fa-solid fa-heart btn-reacte rounded-4"
                                :class="{ like: liked }"
                                @click="handleLike()"></i
                            >&nbsp;
                            <span>{{ video.likeCount }}</span>
                        </div>
                        <div class="fs-5">
                            <i
                                class="fa-solid fa-folder-plus btn-reacte rounded-4"
                                @click="addVideo(video._id)"></i
                            >&nbsp; <span>Favorite</span>
                        </div>
                    </div>
                    <div class="row justify-content-center">
                        <button
                            class="col-5 p-2 mb-2 text-center rounded-3 fs-5"
                            style="
                                background-color: var(--btn);
                                color: var(--text_title);
                            "
                            @click="isShow = !isShow">
                            <span v-if="isShow">
                                <span class="me-2">Show less</span>
                                <i class="fa-solid fa-caret-up"></i>
                            </span>
                            <span v-else>
                                <span class="me-2">Show more</span>
                                <i class="fa-solid fa-caret-down"></i>
                            </span>
                        </button>
                        <div
                            v-if="isShow"
                            class="rounded-2 p-3"
                            style="background-color: var(--bg_detail_video)">
                            <p class="">
                                <i class="fa-solid fa-calendar-days"></i>&nbsp;
                                {{ video.publishedAt }}
                            </p>
                            <p
                                v-if="
                                    video.description &&
                                    video.description !== 'undefined'
                                "
                                style="white-space: pre-line">
                                {{ video.description }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- add :key to refresh component -->
            <div class="col-sm-12 my-4">
                <Comment
                    :key="video._id"
                    :videoId="video._id"
                    :admin="
                        video.accountId === this.accountStore.account._id
                    "></Comment>
            </div>
        </div>
        <div class="col-12 col-xl-4">
            <VideoCard
                :category="video.category"
                :key="video._id"
                :videoIdCurrent="video._id"></VideoCard>
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
import videoService from '../services/video.service';
import accountService from '../services/account.service';
import Navigation from '../components/Navigation.vue';
import Comment from '../components/Comment.vue';
import Header from '../components/Header.vue';
import { useAccountStore } from '../store/account';
import { useVideoStore } from '../store/video';
import { useExtraStore } from '../store/extra';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import VideoCard from '../components/VideoCard.vue';
import VideoRelate from '../components/VideoRelate.vue';
import VideoController from '../components/VideoController.vue';
import Artplayer from '../components/Artplayer.vue';
export default {
    setup() {
        const accountStore = useAccountStore();
        const videoStore = useVideoStore();
        const extraStore = useExtraStore();
        return { accountStore, videoStore, extraStore };
    },
    components: {
        Navigation,
        Header,
        Comment,
        Loading,
        VideoCard,
        VideoRelate,
        VideoController,
        Artplayer,
    },
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            video: {},
            urlVideo: '',
            liked: false,
            isLoading: true,
            fullPage: false,
            onCancel: false,
            isShow: false,
            avatarChannel: '',
            option: {
                autoplay: true,
                pip: true,
                screenshot: true,
                setting: true,
                loop: false,
                flip: true,
                playbackRate: true,
                aspectRatio: true,
                fullscreen: true,
                fullscreenWeb: true,
                subtitleOffset: true,
                miniProgressBar: true,
                mutex: true,
                backdrop: true,
                playsInline: true,
                autoPlayback: true,
                airplay: true,
                theme: '#4e2a7d',
            },
            style: {
                width: '100%',
                height: '480px',
            },
        };
    },
    methods: {
        async getVideo(id) {
            try {
                this.video = await videoService.get(id);
                this.format;
                this.urlVideo = this.video.videoUpload.url;
                this.option.url = this.urlVideo;
                for (let i = 0; i < this.video.usersLike.length; i++) {
                    if (
                        JSON.parse(JSON.stringify(this.video.usersLike[i])) ===
                        this.accountStore.account._id
                    )
                        this.liked = true;
                }
            } catch (err) {
                console.log(err);
                this.$router.push({
                    name: 'notfound',
                    params: {
                        pathMatch: this.$route.path.split('/').slice(1),
                    },
                    query: this.$route.query,
                    hash: this.$route.hash,
                });
            }
        },
        addVideo(id) {
            this.accountStore.addVideo(id);
        },
        async like(id, videoId) {
            await videoService.like(id, videoId);
            this.liked = true;
        },
        async unlike(id, videoId) {
            await videoService.unlike(id, videoId);
            this.liked = false;
        },
        async handleLike() {
            if (!this.liked) this.liked = false;
            else this.liked = true;
            if (!this.liked)
                await this.like(this.accountStore.account._id, this.video._id);
            else
                await this.unlike(
                    this.accountStore.account._id,
                    this.video._id,
                );
            await this.getVideo(this.id);
        },
        async getAvatarChannel(id) {
            const data = await accountService.get(id);
            this.avatarChannel = data.avatar.url;
        },
    },
    computed: {
        format() {
            this.video.likeCount = this.video.likeCount.toLocaleString('en-US');
            this.video.viewCount = this.video.viewCount.toLocaleString('en-US');
        },
    },
    async mounted() {
        await this.getVideo(this.id);
        await this.getAvatarChannel(this.video.accountId);
        await videoService.addView(this.video._id);

        this.isLoading = false;
    },
};
</script>
<style scoped>
#video {
    height: 50vh !important;
}
@media screen and (max-width: 444px) {
    #video {
        height: 30vh !important;
    }
}
.like {
    color: red;
}
</style>
