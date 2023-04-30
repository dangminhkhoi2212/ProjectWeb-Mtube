<template>
    <div id="app" class="vl-parent">
        <loading
            v-model:active="isLoading"
            :can-cancel="false"
            backgroundColor="#170f23 !important"
            color="#c6bcd3"
            :opacity="1"
            loader="bars"
            :is-full-page="fullPage" />
        <div
            class="page row fixed-top vh-100"
            style="overflow-x: hidden; overflow-y: auto">
            <nav class="col-sm-2" v-if="accountStore.checkAccount()">
                <Navigation></Navigation>
            </nav>
            <div id="main" class="col-sm-10 p-0">
                <Header v-if="accountStore.checkAccount()"></Header>
                <router-view />
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
        await this.accountStore.refresh();
        setTimeout(() => {
            this.isLoading = false;
        }, 500);
    },
};
</script>

<style scoped></style>
