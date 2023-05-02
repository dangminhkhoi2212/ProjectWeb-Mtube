<template>
    <div
        class="d-none d-sm-flex flex-column justify-content-start align-items-center ms-2">
        <div id="logo" class="my-3" style="width: 30%">
            <RouterLink :to="{ name: 'home' }" class="logo">
                <img class="w-100" src="../assets/images/logo.png" alt="" />
            </RouterLink>
        </div>
        <hr />
        <div
            class="d-flex flex-column justify-content-start text-center text-xl-start gap-4 gap-xl-3">
            <RouterLink :to="{ name: 'home' }" class="p-2 p-xl-3">
                <span class="text-white fs-5">
                    <span class="me-xl-2">
                        <i class="fa-brands fa-hotjar"></i>
                    </span>
                    <span class="d-none d-xl-inline">Trending</span>
                </span>
            </RouterLink>
            <RouterLink :to="{ name: 'myvideos' }" class="p-2 p-xl-3">
                <span class="text-white fs-5">
                    <span class="me-xl-2">
                        <i class="fa-solid fa-clapperboard"></i>
                    </span>
                    <span class="d-none d-xl-inline">My Videos</span>
                </span>
            </RouterLink>
            <div class="commingup p-4 p-xl-3" @click="commingup">
                <span class="text-white fs-5">
                    <span class="me-xl-2">
                        <i class="fa-solid fa-cloud-arrow-up fa-beat-fade"></i>
                    </span>
                    <span class="d-none d-xl-inline">Uploads</span>
                </span>
            </div>
            <div class="commingup p-4 p-xl-3" @click="commingup">
                <span class="text-white fs-5">
                    <span class="me-xl-2">
                        <i class="fa-solid fa-comment fa-beat-fade"></i>
                    </span>
                    <span class="d-none d-xl-inline">Chat</span>
                </span>
            </div>
        </div>
    </div>
    <nav class="navbar navbar-dark bg-dark fixed-top d-sm-none">
        <div class="container-fluid">
            <div
                class="ms-4"
                style="width: 2.5rem"
                @click="this.extraStore.changeActive('Trending')">
                <RouterLink :to="{ name: 'home' }" class="logo active_nav">
                    <img class="w-100" src="../assets/images/logo.png" alt="" />
                </RouterLink>
            </div>
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasDarkNavbar"
                aria-controls="offcanvasDarkNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div
                class="offcanvas offcanvas-end text-bg-dark"
                tabindex="-1"
                id="offcanvasDarkNavbar"
                aria-labelledby="offcanvasDarkNavbarLabel"
                style="width: 70vw !important">
                <div class="offcanvas-header">
                    <h5
                        class="offcanvas-title"
                        id="offcanvasDarkNavbarLabel"></h5>
                    <button
                        type="button"
                        class="btn-close btn-close-white"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <div class="d-flex">
                        <input
                            class="form-control me-2"
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

                    <ul
                        class="navbar-nav row justify-content-start flex-grow-1 gap-4 mt-5">
                        <li class="nav-item col-12 mt-4">
                            <RouterLink
                                :to="{ name: 'home' }"
                                class="p-2 p-xl-3">
                                <span class="text-white fs-5">
                                    <span class="me-2">
                                        <i class="fa-brands fa-hotjar"></i>
                                    </span>
                                    <span class="my-2">Trending</span>
                                </span>
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink
                                :to="{ name: 'myvideos' }"
                                class="p-2 p-xl-3">
                                <span class="text-white fs-5">
                                    <span class="me-2">
                                        <i class="fa-solid fa-clapperboard"></i>
                                    </span>
                                    <span>My Videos</span>
                                </span>
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <div
                                class="commingup p-2 p-xl-3"
                                @click="commingup">
                                <span class="text-white fs-5">
                                    <span class="me-2">
                                        <i
                                            class="fa-solid fa-cloud-arrow-up fa-beat-fade"></i>
                                    </span>
                                    <span class="">Uploads</span>
                                </span>
                            </div>
                        </li>
                        <li class="nav-item">
                            <div class="commingup px-2" @click="commingup">
                                <span class="text-white fs-5">
                                    <span class="me-2">
                                        <i
                                            class="fa-solid fa-comment fa-beat-fade"></i>
                                    </span>
                                    <span class="">Chat</span>
                                </span>
                            </div>
                        </li>

                        <li class="nav-item">
                            <div
                                class="d-flex gap-3 align-items-center justify-content-center"
                                v-if="account">
                                <div class="" style="">
                                    <router-link to="/user/editprofile"
                                        ><li
                                            class="dropdown-item"
                                            style="color: var(--text)">
                                            <img
                                                style="
                                                    width: 60px !important;
                                                    height: 60px !important;
                                                    border-radius: 50%;
                                                    object-fit: cover;
                                                "
                                                :src="account.image"
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
                                        <span class="">My Account</span>
                                    </button>
                                    <ul class="dropdown-menu">
                                        <router-link to="/user/editprofile"
                                            ><li
                                                class="dropdown-item"
                                                style="color: var(--text)">
                                                Edit Profile
                                            </li>
                                        </router-link>
                                        <RouterLink to="/user/login"
                                            ><li
                                                @click="removeAccount()"
                                                class="dropdown-item"
                                                style="color: var(--text)">
                                                Log out
                                            </li>
                                        </RouterLink>
                                    </ul>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</template>
<script>
import { useAccountStore } from '../store/account';
import { useVideoStore } from '../store/video';
import { useExtraStore } from '../store/extra';
export default {
    setup() {
        const accountStore = useAccountStore();
        const videoStore = useVideoStore();
        const extraStore = useExtraStore();
        return { accountStore, videoStore, extraStore };
    },
    data() {
        return {
            inputSearch: '',
            account: this.accountStore.account,
        };
    },
    components: {},
    methods: {
        removeAccount() {
            this.accountStore.account = {};
            localStorage.removeItem('id');
        },
        updateInputSearch(input) {
            if (input) {
                this.videoStore.updateInputSearch(input);
                this.$router.push({ name: 'search' });
            }
        },
        commingup() {
            this.extraStore.myAlert(
                'info',
                'This feature will appear in the future. 😊',
            );
        },
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
        },
    },
};
</script>
<style scoped>
.logo.active_nav {
    background-color: transparent;
}
.commingup {
    cursor: pointer;
    opacity: 0.6;
}
</style>
