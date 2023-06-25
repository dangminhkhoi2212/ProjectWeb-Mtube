<template>
    <nav class="d-flex flex-column text-center text-xl-start z-9999">
        <div id="logo" class="mx-5 py-2" style="width: 4rem; height: 5rem">
            <RouterLink
                :to="{ name: 'home' }"
                class="logo d-flex align-items-center gap-2">
                <img src="../assets/images/logo.png" alt="" />
                <span class="d-none d-xl-inline fs-5 p-0 m-0">Mtube</span>
            </RouterLink>
        </div>
        <hr />
        <RouterLink :to="{ name: 'home' }" class="p-2 p-xl-3">
            <span class="text-white fs-5">
                <span class="me-xl-2">
                    <i class="fa-brands fa-hotjar"></i>
                </span>
                <span class="d-none d-xl-inline">Trending</span>
            </span>
        </RouterLink>
        <RouterLink :to="{ name: 'favorite' }" class="p-2 p-xl-3">
            <span class="text-white fs-5">
                <span class="me-xl-2">
                    <i class="fa-solid fa-clapperboard"></i>
                </span>
                <span class="d-none d-xl-inline">Favorite </span>
            </span>
        </RouterLink>
        <RouterLink :to="{ name: 'uploadVideo' }" class="p-2 p-xl-3">
            <span class="text-white fs-5">
                <span class="me-xl-2">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                </span>
                <span class="d-none d-xl-inline">Upload </span>
            </span>
        </RouterLink>
        <RouterLink :to="{ name: 'chat' }" class="p-2 p-xl-3">
            <span class="text-white fs-5">
                <span class="me-xl-2">
                    <i class="fa-solid fa-comment"></i>
                </span>
                <span class="d-none d-xl-inline">Chat </span>
            </span>
        </RouterLink>
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
            isDetailPage: this.$route.name === 'detail',
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
    mounted() {},
};
</script>
<style scoped>
.logo.active_nav {
    background-color: transparent !important;
}
</style>
