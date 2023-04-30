<template>
    <div class="row mt-5 mt-md-0 text-break vl-parent">
        <div class="col-sm-8 overflow-auto" style="height: 88vh">
            <div id="video" class="mt-5 mt-sm-0">
                <iframe
                    class="mt-3 mt-sm-0"
                    width="100%"
                    height="100%"
                    :src="urlVideo"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen></iframe>
            </div>
            <div class="mx-1">
                <p class="p-3 fs-2">
                    {{ video.title }}
                </p>
                <hr />
                <div class="">
                    <p class="fs-3">
                        <i
                            class="fa-solid fa-house-fire"
                            style="color: var(--text_title)"></i
                        >&nbsp;
                        {{ video.channelTitle }}
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
                    <button
                        class="col-12 mb-2 text-center rounded-3 fs-5"
                        style="
                            background-color: var(--bg_title);
                            color: var(--text_title);
                        "
                        @click="detail = !detail">
                        <span class="me-2">Description</span>
                        <i v-if="detail" class="fa-solid fa-caret-up"></i>
                        <i v-else class="fa-solid fa-caret-down"></i>
                    </button>
                    <div v-if="detail">
                        <p class="">
                            <i class="fa-solid fa-calendar-days"></i>&nbsp;
                            {{ video.publishedAt }}
                        </p>
                        <p style="white-space: pre-line">
                            {{ video.description }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <!-- add :key to refresh component -->
        <div class="col-sm-4">
            <Comment :key="video.videoId" :videoId="video.videoId"></Comment>
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
import Navigation from '../components/Navigation.vue';
import Comment from '../components/Comment.vue';
import Header from '../components/Header.vue';
import { useAccountStore } from '../store/account';
import { useVideoStore } from '../store/video';
import { useExtraStore } from '../store/extra';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

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
    },
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            video: {
                type: Object,
            },
            urlVideo: '',
            liked: false,
            isLoading: true,
            fullPage: false,
            onCancel: false,
            detail: false,
        };
    },
    methods: {
        async getVideo(id) {
            try {
                this.video = await videoService.get(id);
                this.format;
                this.urlVideo = `https://www.youtube-nocookie.com/embed/${this.video.videoId}`;
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
    },
    computed: {
        format() {
            this.video.likeCount = this.video.likeCount.toLocaleString('en-US');
            this.video.viewCount = this.video.viewCount.toLocaleString('en-US');
        },
    },
    async mounted() {
        await this.getVideo(this.id);
        await videoService.addView(this.video._id);
        await this.getVideo(this.id);
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
