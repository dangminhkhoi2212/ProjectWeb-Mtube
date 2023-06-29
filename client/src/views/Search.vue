<template>
    <section class="px-sm-5 vl-parent">
        <div class="d-flex">
            <div v-for="field in navFields" :key="field">
                <div
                    role="button"
                    class="btn fs-5"
                    :class="{ active_btn: activeField === field }"
                    @click="changeNavFields(field)">
                    {{ field }}
                    <span v-if="field === 'Videos'">
                        {{ videos.length }}
                    </span>
                    <span v-else>{{ accounts.length }}</span>
                </div>
            </div>
        </div>
        <hr class="m-0" />
        <VideoCard
            v-if="videos.length > 0 && activeField === 'Videos'"
            :key="this.$route.params.textSearch"
            :videos="videos"
            :option="option"
            :style="style"
            class="customArtplayer"></VideoCard>
        <div
            v-else-if="accounts.length > 0 && activeField === 'Channels'"
            class="d-flex justify-content-center flex-wrap gap-2 gap-sm-5 my-3">
            <ProfileCard
                v-for="account in accounts"
                :account="account"></ProfileCard>
        </div>

        <div
            v-else
            class="d-flex justify-content-center align-items-center my-3">
            <h4 style="font-style: italic">
                Didn't find any videos or channels
            </h4>
        </div>
        <Loading
            v-model:active="loading.isLoading"
            :can-cancel="loading.onCancel"
            :is-full-page="loading.isfullPage"
            :opacity="0.5"
            backgroundColor="#170f23 !important"
            color="#c6bcd3"
            loader="bars" />
    </section>
</template>
<script>
import VideoCard from '../components/VideoCard.vue';
import videoService from '../services/video.service';
import accountService from '../services/account.service';
import { useAccountStore } from '../store/account';
import { convertISODate } from '../utils/date.utils';
import Loading from 'vue-loading-overlay';
import ProfileCard from '../components/ProfileCard.vue';
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
        Loading,
        ProfileCard,
    },
    data() {
        return {
            Account: this.accountStore.account,
            videos: [],
            accounts: [],
            navFields: ['Videos', 'Channels'],
            activeField: 'Videos',
            loading: {
                isLoading: true,
                isFullPage: false,
            },
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
                this.videos = await videoService.getAll(this.textSearch);

                this.videos.forEach((video) => {
                    video.publishedAt = `${convertISODate(video.publishedAt)}`;
                });
            } catch (error) {
                console.log(
                    '🚀 ~ file: Search.vue:44 ~ getAllVideos ~ error:',
                    error,
                );
            }
        },
        async getAllAccounts() {
            try {
                this.accounts = await accountService.getAll(this.textSearch);
            } catch (error) {
                console.log(
                    '🚀 ~ file: Search.vue:102 ~ getAllAccounts ~ error:',
                    error,
                );
            }
        },
        changeNavFields(field) {
            this.activeField = field;
        },
    },
    computed: {},
    async mounted() {
        await this.getAllVideos();
        console.log(
            '🚀 ~ file: Search.vue:112 ~ created ~ await this.getAllVideos();:',
            this.videos,
        );
        await this.getAllAccounts();
        console.log(
            '🚀 ~ file: Search.vue:114 ~ created ~ await this.getAllAccounts():',
            this.accounts,
        );

        this.loading.isLoading = false;
    },
};
</script>
<style scoped></style>
