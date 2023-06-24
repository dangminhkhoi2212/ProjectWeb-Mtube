<template>
    <div id="app">
        <loading
            v-model:active="isLoading"
            :can-cancel="false"
            backgroundColor="#170f23 !important"
            color="#c6bcd3"
            :opacity="1"
            loader="bars"
            :is-full-page="fullPage" />
        <div
            v-if="this.$route.name !== 'detail'"
            class="page row fixed-top vh-100"
            style="overflow-x: hidden; overflow-y: auto">
            <Navigation
                class="d-none d-sm-flex col-sm-2"
                v-if="accountStore.checkAccount()"></Navigation>
            <div
                id="main"
                class="p-0"
                :class="
                    !accountStore.checkAccount() ? 'col-sm-12' : 'col-sm-10'
                "
                style="overflow-y: auto">
                <Header v-if="accountStore.checkAccount()"></Header>
                <router-view :key="this.$route" />
            </div>
        </div>
        <div
            class="page row fixed-top vh-100"
            style="overflow-x: hidden; overflow-y: auto"
            v-if="this.$route.name === 'detail'">
            <div id="main" class="col-sm-12 p-0" style="margin-top: 69px">
                <Header v-if="accountStore.checkAccount()"></Header>
                <router-view :key="this.$route" />
            </div>
        </div>
    </div>
</template>

<script>
import { useAccountStore } from './store/account';
import { useExtraStore } from './store/extra';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import Header from './components/Header.vue';
import Navigation from './components/Navigation.vue';
export default {
    setup() {
        const accountStore = useAccountStore();
        const useExtra = useExtraStore();
        return { accountStore, useExtra };
    },
    data() {
        return {
            isLoading: true,
            fullPage: true,
            onCancel: false,
        };
    },
    components: {
        Loading,
        Navigation,
        Header,
    },
    methods: {},
    async mounted() {
        if (this.accountStore.account === null)
            await this.accountStore.getAccount();
        setTimeout(() => {
            this.isLoading = false;
        }, 500);
    },
};
</script>

<style scoped></style>
