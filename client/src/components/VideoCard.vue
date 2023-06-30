<template>
    <div
        class="row row-cols-1"
        :class="isDetailPage ? '' : 'row-cols-sm-2 row-cols-xl-3'">
        <div class="col p-0 m-0" v-for="video in videos" :key="video._id">
            <router-link
                v-if="video.accountId"
                style="text-decoration: none; color: inherit"
                :to="{
                    name: 'detail',
                    params: {
                        id: video._id,
                    },
                }"
                class="row py-2">
                <div
                    :class="
                        isDetailPage
                            ? 'col-5 col-sm-4 col-md-4 col-lg-6 col-xl-5'
                            : 'col-12'
                    ">
                    <Artplayer
                        class="my-1 overflow-hidden"
                        :alt="video.title"
                        v-if="video.videoUpload.url"
                        :option="{
                            ...option,
                            url: video.videoUpload.url,
                        }"
                        :style="style"></Artplayer>
                </div>
                <div
                    class="d-flex"
                    :class="
                        isDetailPage
                            ? 'ms-0 col-7 col-sm-8 col-md-6 col-lg-6 col-xl-7 p-0'
                            : ''
                    ">
                    <div v-if="!isDetailPage" class="col-2 col-sm-3 col-md-2">
                        <RouterLink
                            v-if="video.accountId"
                            :to="{
                                name: 'profile',
                                params: {
                                    accountId: video.accountId._id,
                                },
                            }">
                            <AvatarCircle
                                class="my-2"
                                :src="video.accountId.avatar.url">
                            </AvatarCircle>
                        </RouterLink>
                    </div>
                    <div
                        :class="
                            !isDetailPage
                                ? 'col-10 col-sm-9 col-md-10'
                                : 'col-12'
                        ">
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
                            class="row p-0 m-0"
                            style="
                                color: var(--text_white_50);
                                font-size: 0.8rem;
                                font-weight: 300;
                            ">
                            <div class="m-0 p-0 col-10">
                                <p class="p-0 m-0">
                                    <RouterLink
                                        v-if="video.accountId"
                                        :to="{
                                            name: 'profile',
                                            params: {
                                                accountId: video.accountId._id,
                                            },
                                        }">
                                        {{ video.channelTitle }}
                                    </RouterLink>
                                </p>
                                <div class="row m-0 p-0">
                                    <p class="col-4 p-0 m-0">
                                        {{ video.viewCount + ' views' }}
                                    </p>
                                    <span class="col-1 p-0 m-0">•</span>
                                    <p class="col-5 p-0 m-0">
                                        {{ video.publishedAt }}
                                    </p>
                                </div>
                            </div>
                            <div
                                v-if="
                                    isFavoriteVideo ||
                                    (isProfile &&
                                        video.accountId._id ===
                                            this.accountStore.account._id)
                                "
                                class="text-center border-0 col-1">
                                <div class="dropdown">
                                    <button
                                        class="dropdown-toggle"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="true"></button>
                                    <ul class="dropdown-menu">
                                        <router-link
                                            v-if="
                                                isProfile &&
                                                video.accountId._id ===
                                                    this.accountStore.account
                                                        ._id
                                            "
                                            :to="{
                                                name: 'uploadVideo',
                                                query: {
                                                    videoEdit: JSON.stringify({
                                                        _id: video._id,
                                                        title: video.title,
                                                        description:
                                                            video.description,
                                                        videoUpload:
                                                            video.videoUpload,
                                                        tags: video.tags,
                                                        allowComment:
                                                            video.allowComment,
                                                        category:
                                                            video.category,
                                                        region: video.region,
                                                    }),
                                                },
                                            }"
                                            ><li
                                                class="dropdown-item"
                                                style="color: var(--text)">
                                                Edit
                                            </li>
                                        </router-link>
                                        <li
                                            class="dropdown-item"
                                            style="color: var(--text)"
                                            @click.prevent="
                                                removeVideo(video._id)
                                            ">
                                            Delete
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
import VideoController from './VideoController.vue';
import Artplayer from './Artplayer.vue';
import AvatarCircle from './AvatarCircle.vue';
import { useAccountStore } from '../store/account';
export default {
    setup() {
        const accountStore = useAccountStore();
        return { accountStore };
    },
    props: {
        videos: {
            type: Array,
            default: [],
        },
        option: {
            type: Object,
        },
        style: {
            type: Object,
        },
    },
    components: {
        Artplayer,
        AvatarCircle,
    },
    data() {
        return {
            isDetailPage: this.$route.name === 'detail',
            isFavoriteVideo: this.$route.name === 'favorite',
            isProfile: this.$route.name === 'profile',
            accountId: this.accountStore.account._id,
        };
    },
    methods: {
        removeVideo(videoId) {
            if (this.isFavoriteVideo)
                this.$emit('removeFavoriteVideo', videoId);
            else this.$emit('removeMyVideo', videoId);
        },
    },
    mounted() {},
};
</script>

<style scoped></style>
