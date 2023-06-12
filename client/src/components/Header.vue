<template>
    <div
        class="d-none d-sm-block"
        :class="this.$route.name === 'detail' ? 'fixed-top' : 'sticky-top'"
        style="min-height: 70px">
        <div
            class="row justify-content-center align-items-center myborder"
            style="background-color: var(--violet_100)">
            <div class="col-2 ms-3">
                <navigation-mobile></navigation-mobile>
            </div>
            <div class="container-fluid my-3 col-5 d-flex">
                <div class="d-flex col-8">
                    <input
                        class="form-control me-2 border border-0 text-white"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        style="background-color: var(--bg_input)"
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
                class="d-flex gap-3 align-items-center justify-content-center account col-3"
                v-if="this.accountStore.account">
                <div class="" style="">
                    <router-link :to="{ name: 'editprofile' }"
                        ><li class="dropdown-item" style="color: var(--text)">
                            <img
                                style="
                                    width: 48px !important;
                                    height: 48px !important;
                                    border-radius: 50%;
                                    object-fit: cover;
                                "
                                :src="this.accountStore.account.avatar.url"
                                alt="" />
                        </li>
                    </router-link>
                </div>
                <div class="dropdown">
                    <button
                        class="btn btn-secondary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="true">
                        <span class="d-none d-lg-inline m-0">My Account</span>
                    </button>
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
        };
    },
    components: { NavigationMobile },
    methods: {
        removeAccount() {
            this.accountStore.account = {};
            localStorage.removeItem('id');
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
