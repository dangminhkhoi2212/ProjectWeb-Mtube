<template>
    <div class="row mt-md-0 text-break vl-parent px-2">
        <div class="col-12 col-lg-7 col-xl-8">
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
                                    accountId: video.accountId._id,
                                },
                            }">
                            <div class="d-flex align-items-center">
                                <AvatarCircle
                                    class="p-2"
                                    :src="
                                        video.accountId.avatar.url
                                    "></AvatarCircle>
                                <span class="fs-5 d-inline">
                                    {{ video.channelTitle }}
                                </span>
                            </div>
                        </RouterLink>
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
                                @click="addFavoriteVideo(video._id)"></i
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
            <div v-if="video.allowComment" class="col-sm-12 my-4">
                <Comment
                    :key="video._id"
                    :videoId="video._id"
                    :accountId="video.accountId._id"></Comment>
            </div>
            <div v-else class="col-sm-12 my-4 text-center">
                <span class="fs-5">Blocked comment</span>
            </div>
        </div>

        <div class="col-12 col-lg-5 col-xl-4 p-0 m-0">
            <VideoCard
                :class="this.$route.name === 'detail' ? 'customArtplayer' : ''"
                :videos="relaviteVideos"
                :option="optionRelativeVideo"
                :style="styleRelativeVideo"></VideoCard>
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
import Artplayer from '../components/Artplayer.vue';
import alertUtil from '../utils/myAlert';
import { convertISOTime, convertISODate } from '../utils/date.utils';

import AvatarCircle from '../components/AvatarCircle.vue';
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
        Artplayer,
        AvatarCircle,
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
            relaviteVideos: [],
            urlVideo: '',
            liked: false,
            isLoading: true,
            fullPage: false,
            onCancel: false,
            isShow: false,
            avatarChannel: '',
            option: {
                autoplay: false,
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
                marginBottom: '1rem',
            },
            optionRelativeVideo: {
                autoplay: false,
            },
            styleRelativeVideo: {
                width: '100%',
                height: '120px',
                borderRadius: '15px',
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
        async getRelativeVideo() {
            try {
                const relative = this.video.category;
                const result = await videoService.getAll();

                this.relaviteVideos = result.filter(
                    (video) =>
                        video.category === relative &&
                        video._id !== this.video._id,
                );
                this.relaviteVideos = this.relaviteVideos.map((video) => {
                    const datetemp = convertISODate(video.publishedAt);
                    return { ...video, publishedAt: datetemp };
                });
            } catch (error) {
                console.log(
                    '🚀 ~ file: DetailVideo.vue:231 ~ getRelativeVideo ~ error:',
                    error,
                );
            }
        },
        async addFavoriteVideo(videoId) {
            try {
                const result = await accountService.addFavoriteVideo(
                    this.accountStore.account._id,
                    videoId,
                );
                if (result.added)
                    alertUtil.myAlert(
                        'success',
                        "Added into your 'My Videos' 🥳",
                    );
                else
                    alertUtil.myAlert(
                        'error',
                        "This Video exist in your 'My Videos'😭",
                    );
            } catch (error) {
                console.log(
                    '🚀 ~ file: DetailVideo.vue:322 ~ addFavoriteVideo ~ error:',
                    error,
                );
            }
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
    },
    computed: {
        format() {
            this.video.likeCount = this.video.likeCount.toLocaleString('en-US');
            this.video.viewCount = this.video.viewCount.toLocaleString('en-US');
        },
    },
    async mounted() {
        await videoService.addView(this.id);

        await this.getVideo(this.id);
        this.video.publishedAt = `${convertISOTime(
            this.video.publishedAt,
        )}, ${convertISODate(this.video.publishedAt)}`;

        await this.getRelativeVideo();
        this.isLoading = false;
    },
};
</script>
<style scoped>
.like {
    color: red;
}
</style>
