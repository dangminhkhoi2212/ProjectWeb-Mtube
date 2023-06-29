<template>
    <div class="d-flex flex-column justify-content-center gap-2">
        <div v-for="account in accountsFollow" :key="account" class="vl-parent">
            <ProfileCard :account="account"></ProfileCard>
            <Loading
                v-model:active="loading.isLoading"
                :can-cancel="loading.onCancel"
                :is-full-page="loading.isfullPage"
                :opacity="0.5"
                backgroundColor="#170f23 !important"
                color="#c6bcd3"
                loader="bars" />
        </div>
    </div>
</template>

<script>
import ProfileCard from '../components/ProfileCard.vue';
import accountService from '../services/account.service';
import { useAccountStore } from '../store/account';
import Loading from 'vue-loading-overlay';

export default {
    setup() {
        const accountStore = useAccountStore();

        return { accountStore };
    },
    props: {
        activeField: { type: String, required: true },
    },
    components: {
        ProfileCard,
        Loading,
    },
    data() {
        return {
            accountsFollow: [],
            loading: {
                isLoading: true,
                isfullPage: false,
                onCancel: false,
            },
        };
    },
    methods: {
        async getAccountsFollow() {
            if (this.activeField === 'followers') {
                this.accountStore.account.followers.forEach(
                    async (accountId) => {
                        var data = await accountService.getAccount(accountId);
                        this.accountsFollow.push(data);
                    },
                );
            } else if (this.activeField === 'following') {
                this.accountStore.account.following.forEach(
                    async (accountId) => {
                        var data = await accountService.getAccount(accountId);
                        this.accountsFollow.push(data);
                    },
                );
            }
        },
    },
    async mounted() {
        await this.getAccountsFollow();
        this.loading.isLoading = false;
    },
};
</script>

<style lang="scss" scoped></style>
