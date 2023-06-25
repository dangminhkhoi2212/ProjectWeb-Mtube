<template>
    <div
        class="d-sm-block"
        :class="isDetailPage ? 'fixed-top' : 'sticky-top'"
        style="min-height: 70px">
        <div
            class="d-flex align-items-center justify-content-around myborder"
            style="background-color: var(--violet_100)">
            <div class="ms-3" :class="isDetailPage ? 'd-inline' : 'd-sm-none'">
                <navigation-mobile></navigation-mobile>
            </div>
            <div class="col-6 my-3">
                <div class="d-flex">
                    <input
                        class="me-2 p-2 rounded-2 border border-0 text-white"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        style="background-color: var(--bg_input); width: 80%"
                        v-model="inputSearch"
                        @keyup.enter="gotoSearch(inputSearch)" />
                    <button
                        class="btn"
                        @click="gotoSearch(inputSearch)"
                        style="
                            box-shadow: 0 0 1px 2px var(--btn);
                            color: var(--text);
                        ">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            </div>
            <div
                class="d-none d-sm-flex gap-sm-3 align-items-center justify-content-center account"
                v-if="this.accountStore.account">
                <div class="p-0 m-0" style="">
                    <router-link
                        :to="{
                            name: 'profile',
                            params: {
                                accountId: this.accountStore.account._id,
                            },
                        }">
                        <li class="dropdown-item" style="color: var(--text)">
                            <avatar-circle
                                :src="
                                    this.accountStore.account.avatar.url
                                "></avatar-circle>
                        </li>
                    </router-link>
                </div>
                <div class="dropdown">
                    <button
                        class="dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="true"></button>
                    <ul class="dropdown-menu">
                        <router-link :to="{ name: 'editprofile' }"
                            ><li
                                class="dropdown-item"
                                style="color: var(--text)">
                                Edit Profile
                            </li>
                        </router-link>
                        <router-link :to="{ name: 'login' }"
                            ><li
                                @click="removeAccount()"
                                class="dropdown-item"
                                style="color: var(--text)">
                                Log out
                            </li>
                        </router-link>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAccountStore } from '../store/account';
import { useVideoStore } from '../store/video';
import AvatarCircle from './AvatarCircle.vue';
import NavigationMobile from './NavigationMobile.vue';
export default {
    setup() {
        const accountStore = useAccountStore();
        const videoStore = useVideoStore();
        return { accountStore, videoStore };
    },
    data() {
        return {
            inputSearch: null,
            isDetailPage: this.$route.name === 'detail',
        };
    },
    components: { NavigationMobile, AvatarCircle },
    methods: {
        removeAccount() {
            this.accountStore.account = {};
            localStorage.removeItem('id');
            localStorage.removeItem('token');
        },
        gotoSearch(input) {
            this.videoStore.updateInputSearch(this.inputSearch);
            if (input) {
                this.$router.push({
                    name: 'search',
                    params: {
                        textSearch: this.inputSearch,
                    },
                });
            }
            this.inputSearch = '';
        },
    },
    mounted() {},
};
</script>

<style scoped>
@media screen and (max-width: 992px) {
    button.btn.btn-secondary.dropdown-toggle::after {
        margin: 0;
    }
}
</style>
