<template>
    <div
        v-if="account && accountStore.account"
        class="px-md-5 vl-parent position-relative">
        <div
            v-if="isDeleteAccount"
            class="space"
            @click="isDeleteAccount = !isDeleteAccount"></div>
        <div
            class="px-md-5 position-relative"
            style="height: 40vh"
            v-if="account.cover"
            :style="{
                backgroundImage: `url(${coverUrl})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }">
            <div class="position-absolute bottom-0 mb-2 px-2">
                <ProfileCard v-if="account" :account="account"></ProfileCard>
            </div>

            <button
                v-if="!isUpdateCover && isProfile"
                class="position-absolute bottom-0 end-0 p-3 rounded-3 m-3"
                style="background-color: var(--btn)"
                @click="handleButtonClick">
                <i class="fa-solid fa-camera"></i>
            </button>
            <div
                v-if="isUpdateCover && isProfile"
                class="position-absolute bottom-0 end-0">
                <i
                    role="button"
                    class="p-3 rounded-3 fa-solid fa-xmark"
                    style="background-color: var(--btn)"
                    @click="handleCancelFile"></i>
                <i
                    role="button"
                    class="p-3 m-3 rounded-3 fa-solid fa-cloud-arrow-up"
                    style="background-color: var(--btn)"
                    @click="updateCover"></i>
            </div>
            <input
                class="d-none"
                type="file"
                ref="file"
                accept="image/png, image/jpeg"
                @change="onFileSelected"
                @cancel="handleCancelFile" />
        </div>
        <div class="py-4">
            <div
                class="d-flex flex-column sticky-top"
                style="
                    top: 70px;
                    background-color: var(--violet_100);
                    z-index: calc(var(--z_index_nav) -1);
                ">
                <div class="d-flex">
                    <div v-for="field in navFields" :key="field">
                        <div
                            role="button"
                            class="btn fs-5"
                            :class="{ active_btn: activeField === field }"
                            @click="changeNavFields(field)">
                            {{ field }}
                        </div>
                    </div>
                </div>
                <hr class="m-0 p-0" />
            </div>
            <!-- ------------------------------------------------- -->
            <Transition name="slide-fade">
                <div v-if="activeField === 'Videos'" :key="1">
                    <VideoCard
                        :key="account.myVideos"
                        class="customArtplayer"
                        :videos="account.myVideos"
                        :style="style"
                        :option="option"
                        @removeMyVideo="removeMyVideo"></VideoCard>
                </div>
                <div v-else-if="activeField === 'About'" class="" :key="2">
                    <div class="row row-cols-1 row-cols-md-3 py-3">
                        <div class="col">
                            <h5>Joined</h5>
                            <p>{{ joined }}</p>
                            <hr />
                        </div>
                        <div class="col">
                            <h5>Total views</h5>
                            <p>
                                {{ getTotalViews() }}
                            </p>
                            <hr />
                        </div>
                        <div class="col">
                            <h5>Following</h5>
                            <p>
                                {{
                                    account.following.length.toLocaleString(
                                        'en-US',
                                    )
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
                            style="
                                color: var(--text);
                                height: 100px;
                                width: 90%;
                            "
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
                        <hr class="my-2" />
                    </div>
                    <div class="d-flex justify-content-center gap-2 mt-4">
                        <button
                            v-if="!isEditDetails && isProfile"
                            class="col-8 col-sm-4 px-2 py-1 rounded-3 text-center"
                            @click="isEditDetails = true"
                            style="
                                background-color: var(--btn);
                                color: var(--text);
                            ">
                            <span>
                                <i
                                    class="fs-4 mx-2 fa-regular fa-pen-to-square"></i
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
                            <i class="fs-4 mx-2 fa-solid fa-cloud-arrow-up"></i
                            >Save
                        </button>
                    </div>
                </div>
                <div v-else :key="3" class="row col-12 col-sm-6">
                    <div
                        class="d-flex justify-content-between align-items-center py-2 mt-2">
                        <h5>Edit Account</h5>
                        <button class="btn">
                            <RouterLink :to="{ name: 'editprofile' }">
                                Go to Edit
                            </RouterLink>
                        </button>
                    </div>
                    <hr />
                    <div
                        class="d-flex justify-content-between align-items-center py-2">
                        <h5>Delete Account</h5>
                        <button class="btn" @click="isDeleteAccount = true">
                            Delete
                        </button>
                    </div>
                    <hr />
                </div>
            </Transition>
        </div>
        <div
            v-if="isDeleteAccount"
            class="d-flex flex-column align-items-center gap-3 position-absolute top-50 start-50 translate-middle p-5 rounded-3"
            style="
                background-color: var(--violet_90);
                z-index: var(--z_index_nav);
            ">
            <h5>Confirm your password</h5>
            <input type="password" class="p-2" v-model="password" />
            <div class="d-flex justify-content-center gap-4">
                <button class="btn" @click="isDeleteAccount = false">
                    Cancle
                </button>
                <button class="btn" @click="deleteAccount">Delete</button>
            </div>
        </div>

        <Loading
            v-model:active="loading.isLoading"
            :can-cancel="loading.onCancel"
            :is-full-page="loading.isfullPage"
            :opacity="0.5"
            backgroundColor="#170f23 !important"
            color="#c6bcd3"
            loader="bars" />
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
import { deleteRest } from '../services/ChatEngine';
import ProfileCard from '../components/ProfileCard.vue';
export default {
    setup() {
        const accountStore = useAccountStore();
        return { accountStore };
    },
    props: {
        accountId: { type: String },
    },
    components: { AvatarCircle, VideoCard, Loading, ProfileCard },
    data() {
        return {
            account: {},
            option: {},
            style: {
                width: '100%',
                height: '180px',
                borderRadius: 'var(--border_radius_video)',
            },
            newCover: null,
            coverUrl: '',
            oldCoverUrl: '',
            navFields: ['Videos', 'About', 'Settings'],
            activeField: this.$route.query.chooseField || 'Videos',
            totalFollowers: [],
            joined: '',
            password: null,
            isEditDetails: false,
            isUpdateCover: false,
            isDeleteAccount: false,
            isProfile: this.accountId === this.accountStore.account._id,
            loading: {
                isLoading: true,
                isfullPage: false,
                onCancel: false,
            },
        };
    },
    watch: {},
    methods: {
        async getProfile() {
            try {
                this.account = await accountService.getAccount(this.accountId);

                this.coverUrl = this.account.cover.url;
                this.oldCoverUrl = this.account.cover.url;
                this.totalFollowers = this.account.followers;

                this.formatDateVideo();
                this.formatJoined();
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
                }
            } catch (error) {
                console.log(
                    '🚀 ~ file: Profile.vue:192 ~ follow ~ error:',
                    error,
                );
            }
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
                this.account = await accountService.update(this.account._id, {
                    biography,
                    media,
                });
                this.formatDateVideo();

                alertUtil.myAlert('success', 'Your video has been deleted.');

                this.isEditDetails = false;
                this.loading.isLoading = false;
            } catch (error) {
                this.loading.isLoading = false;
                alertUtil.myAlert('error', "Don't update detail this video! ");
            }
        },
        handleButtonClick() {
            this.$refs.file.click();
            this.isUpdateCover = true;
        },
        onFileSelected(event) {
            if (event.target.files[0]) {
                this.newCover = event.target.files[0];
                URL.revokeObjectURL(this.newCover);
                this.coverUrl = URL.createObjectURL(event.target.files[0]);
            }
        },
        handleCancelFile() {
            this.isUpdateCover = false;
            this.coverUrl = this.oldCoverUrl;
        },
        async updateCover() {
            try {
                this.loading.isLoading = true;
                this.isUpdateCover = false;
                const form = new FormData();
                form.append('image', this.newCover);
                form.append('selectImage', 'cover');

                this.account = await accountService.update(
                    this.accountStore.account._id,
                    form,
                );
                this.formatDateVideo();

                URL.revokeObjectURL(this.coverUrl);

                this.loading.isLoading = false;
            } catch (error) {
                this.loading.isLoading = false;

                alertUtil.myAlert('error', 'Error while updating');
            }
        },
        changeNavFields(fieldActive) {
            this.activeField = fieldActive;
        },
        async deleteAccount() {
            try {
                if (this.isDeleteAccount && !this.password) return;
                this.loading.isLoading = true;
                await accountService.delete(
                    this.accountStore.account._id,
                    this.password,
                );
                //delete in ChatEngine
                await deleteRest(
                    this.accountStore.account.username,
                    this.accountStore.account._id,
                );

                this.accountStore.account = null;

                localStorage.clear();

                this.loading.isLoading = false;
                this.$router.push({ name: 'login' });
            } catch (error) {
                this.loading.isLoading = false;
                alertUtil.myAlert('error', error.response.data.message);
            }
        },
    },
    async created() {
        await this.getProfile();
        this.loading.isLoading = false;
    },
    async mounted() {
        if (this.chooseField) this.activeField = this.chooseField;
        //remove button settings
        if (!this.isProfile) {
            let index = this.navFields.indexOf('Setting');
            this.navFields = this.navFields.splice(0, index);
        }
        console.log(
            '🚀 ~ file: Profile.vue:486 ~ mounted ~ this.activeField:',
            this.activeField,
        );
    },
};
</script>
<style scoped>
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
