<template>
    <nav
        class="vh-sm-100 vh-100 d-flex flex-column justify-content-between"
        style="z-index: var(--z_index_nav)">
        <div class="d-flex flex-column text-center text-xl-start">
            <RouterLink
                :to="{ name: 'home' }"
                class="logo d-none d-sm-flex align-items-center justify-content-center gap-2 py-2">
                <img
                    src="../assets/images/logo.png"
                    alt=""
                    style="width: 50px" />
                <span class="d-none d-xl-inline fs-5 p-0 m-0">Mtube</span>
            </RouterLink>
            <hr class="d-none d-sm-block p-0" />
            <RouterLink :to="{ name: 'home' }" class="p-2 p-xl-3">
                <span class="fs-5">
                    <span class="me-xl-2">
                        <i class="fa-brands fa-hotjar"></i>
                    </span>
                    <span class="d-none d-xl-inline">Trending</span>
                </span>
            </RouterLink>
            <RouterLink :to="{ name: 'favorite' }" class="p-2 p-xl-3">
                <span class="fs-5">
                    <span class="me-xl-2">
                        <i class="fa-solid fa-clapperboard"></i>
                    </span>
                    <span class="d-none d-xl-inline">Favorite </span>
                </span>
            </RouterLink>
            <RouterLink :to="{ name: 'uploadVideo' }" class="p-2 p-xl-3">
                <span class="fs-5">
                    <span class="me-xl-2">
                        <i class="fa-solid fa-cloud-arrow-up"></i>
                    </span>
                    <span class="d-none d-xl-inline">Upload </span>
                </span>
            </RouterLink>
            <RouterLink :to="{ name: 'chat' }" class="p-2 p-xl-3">
                <span class="fs-5">
                    <span class="me-xl-2">
                        <i class="fa-solid fa-comment"></i>
                    </span>
                    <span class="d-none d-xl-inline">Chat </span>
                </span>
            </RouterLink>
            <RouterLink :to="{ name: 'connection' }" class="p-2 p-xl-3">
                <span class="fs-5">
                    <span class="me-xl-2">
                        <i class="fa-solid fa-users"></i>
                    </span>
                    <span class="d-none d-xl-inline">Connection </span>
                </span>
            </RouterLink>
        </div>
        <AccountTools
            :accountId="accountStore.account._id"
            class="my-4 d-block d-sm-none"></AccountTools>
    </nav>
</template>
<script>
import { useAccountStore } from '../store/account';
import { useExtraStore } from '../store/extra';
import AccountTools from './AccountTools.vue';
export default {
    setup() {
        const accountStore = useAccountStore();
        const extraStore = useExtraStore();
        return { accountStore, extraStore };
    },
    components: {
        AccountTools,
    },
    data() {
        return {
            inputSearch: '',
            account: this.accountStore.account,
            isDetailPage: this.$route.name === 'detail',
        };
    },
    components: { AccountTools },
    methods: {},
    mounted() {},
};
</script>
<style scoped>
.logo.active_nav {
    background-color: transparent !important;
}
.vh-sm-100 {
    height: 100vh !important;
}

@media (max-width: 576px) {
    .vh-sm-100 {
        height: calc(100vh - var(--height_header)) !important;
    }
}
</style>
