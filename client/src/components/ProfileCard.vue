<template>
    <RouterLink
        v-if="accountPropsLocal"
        :key="accountPropsLocal"
        :to="{
            name: 'profile',
            params: {
                accountId: accountPropsLocal._id,
            },
        }">
        <div
            :key="
                accountStore.account.followers || accountStore.account.following
            "
            class="d-flex align-items-center px-3 py-2 rounded-3"
            :class="
                isMyProfile && (isProfilePage || isDetailPage || isSearchPage)
                    ? 'justify-content-start'
                    : 'justify-content-around'
            "
            style="
                /* background-color: var(--bg_profile_card); */
                backdrop-filter: blur(30px);
                width: 320px;
                box-shadow: 0 0 1px 1px var(--box_shadow_card);
            ">
            <AvatarCircle
                v-if="accountPropsLocal.avatar"
                class="mx-2"
                :src="accountPropsLocal.avatar.url"></AvatarCircle>
            <div>
                <p class="m-0">{{ accountPropsLocal.name }}</p>
                <p
                    class="m-0"
                    v-if="accountPropsLocal.followers"
                    :key="accountPropsLocal.followers.length"
                    style="font-size: 0.8rem">
                    {{
                        accountPropsLocal.followers.length.toLocaleString(
                            'en-US',
                        )
                    }}
                    Followers
                </p>
            </div>
            <div v-if="accountPropsLocal._id !== accountStore.account._id">
                <button
                    v-if="!isFollow"
                    class="px-2 py-1 rounded-5"
                    @click.prevent="handleFollow('follow')">
                    Follow
                </button>
                <button
                    v-else
                    class="px-2 py-1 rounded-5"
                    @click.prevent="handleFollow('unfollow')">
                    Unfollow
                </button>
                <Loading
                    v-model:active="loading.isLoading"
                    :can-cancel="loading.onCancel"
                    :is-full-page="loading.isfullPage"
                    :opacity="0.5"
                    class="rounded-3"
                    backgroundColor="#170f23 !important"
                    color="#c6bcd3"
                    loader="bars" />
            </div>
        </div>
    </RouterLink>
</template>

<script>
import { useAccountStore } from '../store/account';
import accountService from '../services/account.service';
import AvatarCircle from './AvatarCircle.vue';
import Loading from 'vue-loading-overlay';
export default {
    setup() {
        const accountStore = useAccountStore();
        return { accountStore };
    },
    props: {
        account: { type: Object },
    },
    components: {
        AvatarCircle,
        Loading,
    },

    data() {
        return {
            accountIdStore: this.accountStore.account._id,
            accountPropsLocal: this.account,
            isFollow: false,
            isProfilePage: this.$route.name === 'profile',
            isDetailPage: this.$route.name === 'detail',
            isSearchPage: this.$route.name === 'search',
            isMyProfile: this.accountStore.account._id === this.account._id,
            loading: {
                isLoading: false,
                isfullPage: false,
                onCancel: false,
            },
        };
    },
    methods: {
        async handleFollow(status) {
            try {
                this.loading.isLoading = true;
                if (this.accountIdStore !== this.account._id) {
                    var result = await accountService.handleFollow(
                        this.accountIdStore,
                        this.account._id,
                        status,
                    );
                    this.accountPropsLocal = result;
                    await this.accountStore.getAccount();
                    this.checkFollow();
                }
                this.loading.isLoading = false;
            } catch (error) {
                this.loading.isLoading = false;

                console.log(
                    '🚀 ~ file: Profile.vue:192 ~ follow ~ error:',
                    error,
                );
            }
        },
        checkFollow() {
            this.isFollow = this.accountPropsLocal.followers.includes(
                this.accountIdStore,
            );
        },
    },
    async mounted() {
        this.checkFollow();
    },
};
</script>

<style scoped></style>
