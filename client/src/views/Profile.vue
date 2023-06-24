<template>
    <div v-if="account" class="px-md-5" style="height: 90vh">
        <div
            class="px-md-5 position-relative"
            style="height: clamp(200px, 20vh, 300px)"
            v-if="account.cover"
            :style="{
                backgroundImage: `url(${account.cover.url})`,
            }">
            <div class="position-absolute bottom-0 col-12 mb-2">
                <div
                    class="col-12 col-md-5 d-flex align-items-center gap-4 p-3 rounded-3"
                    style="
                        backdrop-filter: blur(50px);
                        /* background-color: var(--violet_80); */
                    ">
                    <div style="width: 5rem; height: 5rem" class="">
                        <img
                            :src="account.avatar.url"
                            style="object-fit: cover; border-radius: 50%" />
                    </div>
                    <div>
                        <p class="m-0 fs-5">{{ account.name }}</p>
                        <p
                            class="m-0"
                            :key="totalFollowers"
                            v-if="totalFollowers">
                            {{ totalFollowers.length.toLocaleString('en-US') }}
                            Followers
                        </p>
                    </div>
                    <div v-if="account._id !== accountStore.account._id">
                        <button
                            v-if="!isFollow"
                            class="px-2 py-1 rounded-5"
                            @click="handleFollow('follow')">
                            Follow
                        </button>
                        <button
                            v-else
                            class="px-2 py-1 rounded-5"
                            @click="handleFollow('unfollow')">
                            unFollow
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="py-4 vl-parent">
            <div class="d-flex">
                <div
                    role="button"
                    class="btn fs-5"
                    :class="{ active_btn: showVideos }"
                    @click="
                        () => {
                            showVideos = true;
                            showAbout = false;
                        }
                    ">
                    Videos
                    <span v-if="account.myVideos"
                        >({{ account.myVideos.length.toString() }})</span
                    >
                </div>
                <div
                    role="button"
                    class="btn fs-5"
                    :class="{ active_btn: showAbout }"
                    @click="
                        () => {
                            showAbout = true;
                            showVideos = false;
                        }
                    ">
                    About
                </div>
            </div>
            <hr class="m-0 p-0" />
            <div v-if="showVideos">
                <VideoCard
                    :key="account.myVideos"
                    class="customArtplayer"
                    :videos="account.myVideos"
                    :style="style"
                    :option="option"
                    @removeMyVideo="removeMyVideo"></VideoCard>
            </div>
            <div v-if="showAbout" class="" :key="account">
                <div class="row row-cols-1 row-cols-md-3 py-3">
                    <div class="col">
                        <h5>Joined</h5>
                        <p>{{ joined }}</p>
                        <hr />
                    </div>
                    <div class="col">
                        <h5>Total views</h5>
                        <p>{{ getTotalViews() }}</p>
                        <hr />
                    </div>
                    <div class="col">
                        <h5>Following</h5>
                        <p>
                            {{
                                account.following.length.toLocaleString('en-US')
                            }}
                        </p>
                        <hr />
                    </div>
                </div>
                <div class="row">
                    <h5>Biography</h5>
                    <p v-if="!isEditDetails" :key="account.biography">
                        {{ account.biography }}
                    </p>
                    <textarea
                        class="p-2 my-2 mx-auto"
                        v-else
                        style="color: var(--text); height: 100px; width: 90%"
                        v-model="account.biography">
                    </textarea>
                    <hr />
                </div>
                <div class="row">
                    <h5>Media</h5>
                    <div
                        class="d-flex flex-column flex-sm-row justify-content-around gap-3">
                        <a target="_blank" :href="account.media.facebook">
                            <i
                                class="fs-3 rounded-5 p-2 fa-brands fa-facebook"></i>
                        </a>
                        <input
                            v-if="isEditDetails"
                            type="text"
                            v-model="account.media.facebook" />
                        <!-- ---------------------------------------------------------->
                        <a target="_blank" :href="account.media.instagram">
                            <i
                                class="fs-3 rounded-5 p-2 fa-brands fa-instagram"></i>
                        </a>
                        <input
                            v-if="isEditDetails"
                            type="text"
                            v-model="account.media.instagram" />
                        <!-- ---------------------------------------------------------->
                        <a target="_blank" :href="account.media.tiktok">
                            <i
                                class="fs-3 rounded-5 p-2 fa-brands fa-tiktok"></i>
                        </a>
                        <input
                            v-if="isEditDetails"
                            type="text"
                            v-model="account.media.tiktok" />
                    </div>
                </div>
                <div class="d-flex justify-content-center gap-2 mt-4">
                    <button
                        v-if="!isEditDetails"
                        class="col-8 col-sm-4 px-2 py-1 rounded-3 text-center"
                        @click="isEditDetails = true"
                        style="
                            background-color: var(--btn);
                            color: var(--text);
                        ">
                        <span>
                            <i class="fs-4 mx-2 fa-regular fa-pen-to-square"></i
                            >Edit details
                        </span>
                    </button>
                    <button
                        v-if="isEditDetails"
                        class="rounded-2 text-center"
                        @click="isEditDetails = false"
                        style="
                            background-color: var(--btn);
                            color: var(--text);
                        ">
                        <span>
                            <i class="fs-4 mx-2 fa-solid fa-xmark"></i>
                        </span>
                    </button>
                    <button
                        v-if="isEditDetails"
                        class="col-5 col-sm-2 px-2 py-1 rounded-3 text-center"
                        @click="handleEditDetails"
                        style="
                            background-color: var(--btn);
                            color: var(--text);
                        ">
                        <i class="fs-4 mx-2 fa-solid fa-cloud-arrow-up"></i>Save
                    </button>
                </div>
            </div>
            <Loading
                v-model:active="loading.isLoading"
                :can-cancel="loading.onCancel"
                :is-full-page="loading.fullPage"
                :opacity="0.5"
                backgroundColor="#170f23 !important"
                color="#c6bcd3"
                loader="bars" />
        </div>
    </div>
</template>

<script>
import AvatarCircle from '../components/AvatarCircle.vue';
import accountService from '../services/account.service';
import VideoCard from '../components/VideoCard.vue';
import { useAccountStore } from '../store/account';
import { convertISODate, convertISOTime } from '../utils/date.utils';
import alertUtil from '../utils/myAlert';
import Loading from 'vue-loading-overlay';

export default {
    setup() {
        const accountStore = useAccountStore();
        return { accountStore };
    },
    props: {
        accountId: { type: String },
    },
    components: { AvatarCircle, VideoCard, Loading },
    data() {
        return {
            account: {},
            option: {},
            style: {
                width: '100%',
                height: '180px',
                borderRadius: 'var(--border_radius_video)',
            },
            showVideos: true,
            showAbout: false,
            totalFollowers: [],
            joined: '',
            isFollow: false,
            isEditDetails: false,
            loading: {
                isLoading: false,
                fullPage: false,
                onCancel: false,
            },
        };
    },
    watch: {},
    methods: {
        async getProfile() {
            try {
                this.account = await accountService.getAccount(this.accountId);

                this.formatDateVideo();
                this.checkFollow();
                this.formatJoined();
                this.totalFollowers = this.account.followers;
            } catch (error) {
                console.log(
                    '🚀 ~ file: Profile.vue:31 ~ getProfile ~ error:',
                    error,
                );
            }
        },

        formatDateVideo() {
            this.account.myVideos = this.account.myVideos.map((video) => {
                video.publishedAt = convertISODate(video.publishedAt);
                return video;
            });
        },
        formatJoined() {
            this.joined = `${convertISOTime(
                this.account.join,
            )}, ${convertISODate(this.account.join)}`;
        },
        getTotalViews() {
            if (this.account.myVideos.length > 0) {
                var total = 0;
                this.account.myVideos.forEach((video) => {
                    total += video.viewCount;
                });
                return total;
            }
            return 0;
        },
        async handleFollow(status) {
            try {
                const accountIdA = this.accountStore.account._id;
                const accountIdB = this.accountId;
                if (accountIdA !== accountIdB) {
                    this.account = await accountService.handleFollow(
                        accountIdA,
                        accountIdB,
                        status,
                    );
                    this.totalFollowers = this.account.followers;
                    this.formatDateVideo();
                    this.checkFollow();
                }
            } catch (error) {
                console.log(
                    '🚀 ~ file: Profile.vue:192 ~ follow ~ error:',
                    error,
                );
            }
        },
        checkFollow() {
            const accountIdA = this.accountStore.account._id;
            this.isFollow = this.account.followers.includes(accountIdA);
        },
        async removeMyVideo(videoId) {
            const confirm = await alertUtil.myConfirm(
                'Are you sure?',
                'warning',
                "You won't be able to revert this!",
                'Yes, delete it!',
            );
            if (confirm) {
                try {
                    this.loading.isLoading = true;

                    this.account = await accountService.removeMyVideo(
                        this.accountStore.account._id,
                        videoId,
                    );

                    this.formatDateVideo();

                    alertUtil.myAlert(
                        'success',
                        'Your video has been deleted.',
                    );
                    this.loading.isLoading = false;
                } catch (error) {
                    alertUtil.myAlert('Error!', "Don't delete this video! ");
                    this.loading.isLoading = false;
                }
            }
        },
        async handleEditDetails() {
            try {
                this.isEditDetails = true;
                this.loading.isLoading = true;

                const { biography, media } = this.account;
                this.account = await accountService.editDetail(
                    this.account._id,
                    { biography, media },
                );
                this.formatDateVideo();

                alertUtil.myAlert('success', 'Your video has been deleted.');

                this.isEditDetails = false;
                this.loading.isLoading = false;
            } catch (error) {
                this.loading.isLoading = false;
                alertUtil.myAlert('Error!', "Don't update detail this video! ");
            }
        },
    },
    async mounted() {
        await this.getProfile();
    },
};
</script>
<style scoped>
.btn {
    color: var(--text);
    position: relative;
}
.btn:hover {
    background-color: var(--btn_hover);
}
.active_btn::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: aliceblue;
    transition: all 0.5s linear;
}
::-webkit-scrollbar {
    display: none !important;
}
.fa-brands {
    background-color: var(--btn);
}
textarea,
input {
    color: var(--text);
    width: 100%;
}
</style>
