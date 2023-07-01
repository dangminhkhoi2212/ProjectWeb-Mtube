<template>
    <div
        v-if="video"
        class="row text-break vl-parent px-sm-5"
        style="background-color: var(--background_main)">
        <div
            class="col-12 col-lg-7 col-xl-8"
            style="background-color: var(--background_main)">
            <Artplayer v-if="urlVideo" :option="option" :style="style" />
            <div class="">
                <p class="p-0 fs-4">
                    {{ video.title }}
                </p>
                <div class="">
                    <p class="">
                        <RouterLink
                            v-if="video.accountId"
                            :to="{
                                name: 'profile',
                                params: {
                                    accountId: video.accountId._id,
                                },
                            }">
                            <ProfileCard
                                :account="video.accountId"></ProfileCard>
                        </RouterLink>
                    </p>

                    <div
                        class="w-100 d-flex flex-column flex-sm-row justify-content-around align-items-center my-4 gap-2 text-center">
                        <div
                            class="d-flex gap-5 align-items-center justify-content-between justify-content-sm-start col-12 col-sm-9">
                            <div class="fs-5">
                                <i
                                    class="fa-solid fa-eye btn-reacte rounded-4"></i
                                >&nbsp;
                                <span>{{ video.viewCount }}</span>
                            </div>
                            <div class="fs-5">
                                <i
                                    class="fa-solid fa-heart btn-reacte rounded-4"
                                    :class="{ like: liked }"
                                    @click="handleLike()"></i
                                >&nbsp;
                                <span v-if="video.usersLike">{{
                                    video.usersLike.length
                                }}</span>
                            </div>
                            <div class="fs-5">
                                <i
                                    class="fa-solid fa-folder-plus btn-reacte rounded-4"
                                    @click="addFavoriteVideo(video._id)"></i
                                >&nbsp; <span>Favorite</span>
                            </div>
                        </div>
                        <button
                            class="col-3 p-2 mb-3 text-center rounded-3 fs-5"
                            style="
                                background-color: var(--btn);
                                color: var(--text);
                            "
                            @click="isShow = !isShow">
                            <span v-if="isShow">
                                <span class="me-2">Less</span>
                                <i class="fa-solid fa-caret-up"></i>
                            </span>
                            <span v-else>
                                <span class="me-2">More</span>
                                <i class="fa-solid fa-caret-down"></i>
                            </span>
                        </button>
                    </div>
                    <div class="row justify-content-center">
                        <Transition name="bounce">
                            <div
                                v-if="isShow"
                                class="rounded-2 p-3 mb-3"
                                style="
                                    background-color: var(--bg_detail_video);
                                ">
                                <p class="">
                                    <i class="fa-solid fa-calendar-days"></i
                                    >&nbsp;
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
                        </Transition>
                    </div>
                </div>
            </div>
            <div
                v-if="
                    video.accountId &&
                    video.accountId._id === accountStore.account._id
                "
                class="float-end d-flex gap-2 align-items-center">
                <span>Allow comment</span>
                <label class="switch">
                    <input
                        type="checkbox"
                        :checked="allowComment"
                        @click="handleAllowComment" />
                    <span></span>
                </label>
            </div>
            <Transition name="bounce">
                <div
                    v-if="video.allowComment && allowComment"
                    :key="1"
                    class="col-sm-12 my-4">
                    <Comment
                        :key="video._id"
                        :video="video"
                        :accountId="video.accountId._id"></Comment>
                </div>
                <div v-else :key="2" class="col-sm-12 my-4 text-center">
                    <span class="fs-5">Blocked comment</span>
                </div>
            </Transition>
        </div>

        <div class="col-12 col-lg-5 col-xl-4 p-0 m-0">
            <VideoCard
                :class="this.$route.name === 'detail' ? 'customArtplayer' : ''"
                :videos="relaviteVideos"
                :option="optionRelativeVideo"
                :style="styleRelativeVideo"></VideoCard>
        </div>
        <loading
            v-model:active="loading.isLoading"
            :can-cancel="false"
            backgroundColor="#170f23 !important"
            color="#c6bcd3"
            :opacity="0.6"
            loader="bars"
            :is-full-page="loading.isFullPage" />
    </div>
</template>
<script>
import videoService from '../services/video.service';
import accountService from '../services/account.service';
import Navigation from '../components/Navigation.vue';
import Comment from '../components/Comment.vue';
import Header from '../components/Header.vue';
import { useAccountStore } from '../store/account';
import { useExtraStore } from '../store/extra';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import VideoCard from '../components/VideoCard.vue';
import Artplayer from '../components/Artplayer.vue';
import alertUtil from '../utils/myAlert';
import { convertISOTime, convertISODate } from '../utils/date.utils';
import ProfileCard from '../components/ProfileCard.vue';
import AvatarCircle from '../components/AvatarCircle.vue';
import { formatNumber } from '../utils/format.utils';
export default {
    setup() {
        const accountStore = useAccountStore();
        const extraStore = useExtraStore();
        return { accountStore, extraStore };
    },
    components: {
        Navigation,
        Header,
        Comment,
        Loading,
        VideoCard,
        Artplayer,
        AvatarCircle,
        ProfileCard,
    },
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            video: { type: Object, required: true },
            relaviteVideos: [],
            urlVideo: '',
            liked: { type: Boolean },
            loading: { isLoading: true, isFullPage: false },
            accountId: this.accountStore.account._id,
            isShow: false,
            avatarChannel: '',
            allowComment: { type: Boolean },
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
        async getVideo() {
            try {
                this.video = await videoService.get(this.id);

                this.urlVideo = this.video.videoUpload.url;
                this.option.url = this.urlVideo;
                this.allowComment = this.video.allowComment;
                this.video.viewCount = formatNumber(this.video.viewCount);
                this.video.likeCount = formatNumber(this.video.likeCount);
                this.checkLiked();
            } catch (err) {
                console.log(err);
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
                    alertUtil.myAlert('success', "Added into your 'My Videos'");
                else
                    alertUtil.myAlert(
                        'error',
                        "This Video exist in your 'My Videos'",
                    );
            } catch (error) {
                console.log(
                    '🚀 ~ file: DetailVideo.vue:322 ~ addFavoriteVideo ~ error:',
                    error,
                );
            }
        },
        checkLiked() {
            this.liked = this.video.usersLike.includes(this.accountId);
        },
        async handleLike() {
            try {
                this.liked = !this.liked;
                this.video = await videoService.update(this.id, {
                    accountId: this.accountId,
                    like: this.liked,
                });
                this.checkLiked();
                this.formatPublishAt();
            } catch (error) {
                console.log(
                    '🚀 ~ file: DetailVideo.vue:309 ~ handleLike ~ error:',
                    error,
                );
            }
        },
        async handleAllowComment() {
            try {
                this.allowComment = !this.allowComment;
                this.video = await videoService.update(this.id, {
                    allowComment: this.allowComment,
                });
            } catch (error) {
                console.log(
                    '🚀 ~ file: DetailVideo.vue:313 ~ handleAllowComment ~ error:',
                    error,
                );
            }
        },
        async addView() {
            try {
                this.video = await videoService.update(this.id, {
                    viewCount: Number(this.video.viewCount) + 1,
                });
            } catch (error) {
                console.log(
                    '🚀 ~ file: DetailVideo.vue:324 ~ addView ~ error:',
                    error,
                );
            }
        },
        formatPublishAt() {
            this.video.publishedAt = `${convertISOTime(
                this.video.publishedAt,
            )}, ${convertISODate(this.video.publishedAt)}`;
        },
    },
    computed: {},
    async created() {
        await this.getVideo();
        await this.addView();
        await this.getRelativeVideo();

        this.formatPublishAt();

        this.loading.isLoading = false;
    },
};
</script>
<style scoped>
.like {
    color: red;
}
label.switch {
    --width_btn: 2.5rem;
    text-align: left;
    width: var(--width_btn);
    height: calc(var(--width_btn) / 2);
    border-radius: 60px;
    background-color: var(--btn);
    display: inline-block;
    position: relative;
    cursor: pointer;
}
label.switch > span {
    display: block;
    width: 100%;
    height: 100%;
}
label.switch > input[type='checkbox'] {
    opacity: 0;
    position: absolute;
}
label.switch > span:before,
label.switch > span:after {
    content: '';
    cursor: pointer;
    position: absolute;
}
label.switch > input[type='checkbox'] ~ span {
    box-shadow: 0 0 0 4px var(--text_title);
}
label.switch > input[type='checkbox']:checked:focus ~ span {
    box-shadow: 0 0 0 4px #fff;
}
label.switch > span {
    border-radius: 60px;
}
label.switch > span:before {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    background-color: #f1f1f1;
    border-radius: 60px;
    transition: opacity 0.2s ease-out 0.1s, transform 0.2s ease-out 0.1s;
    transform: scale(1);
    opacity: 1;
}
label.switch > span:after {
    top: 50%;
    z-index: 3;
    transition: transform 0.4s cubic-bezier(0.44, -0.12, 0.07, 1.15);
    width: calc(var(--width_btn) / 2);
    height: calc(var(--width_btn) / 2);
    transform: translate3d(0, -50%, 0);
    background-color: #fff;
    border-radius: 100%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}
label.switch > input[type='checkbox']:checked ~ span:before {
    transform: scale(0);
    opacity: 0.7;
}
label.switch > input[type='checkbox']:checked ~ span:after {
    transform: translate3d(100%, -50%, 0);
}
</style>
