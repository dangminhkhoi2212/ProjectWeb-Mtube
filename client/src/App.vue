<template>
    <div id="app vl-parent">
        <loading
            v-model:active="loading.isLoading"
            :can-cancel="false"
            backgroundColor="#170f23 !important"
            color="#c6bcd3"
            :opacity="1"
            loader="bars"
            :is-full-page="loading.isfullPage" />
        <div class="page row vw-100 vh-100" style="overflow-y: auto">
            <Navigation
                v-if="
                    this.$route.name !== 'detail' && accountStore.checkAccount()
                "
                class="d-none d-sm-flex col-sm-2">
            </Navigation>
            <div
                class="p-0 col-12"
                :class="
                    this.$route.name === 'detail' ? 'col-sm-12' : 'col-sm-10'
                ">
                <Header v-if="accountStore.checkAccount()"></Header>
                <div :id="accountStore.checkAccount() ? 'main' : ''">
                    <router-view :key="this.$route" />
                </div>
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
import accountService from './services/account.service';
export default {
    setup() {
        const accountStore = useAccountStore();
        const useExtra = useExtraStore();
        return { accountStore, useExtra };
    },
    data() {
        return {
            loading: {
                isLoading: false,
                isfullPage: true,
                onCancel: false,
            },
        };
    },
    components: {
        Loading,
        Navigation,
        Header,
    },
    methods: {},
    async mounted() {
        await this.accountStore.getAccount();
        this.loading.isLoading = false;
    },
};
</script>

<style scoped></style>
