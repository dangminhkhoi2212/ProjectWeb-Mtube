<template>
    <section id="main">
        <VideoCard
            :key="this.$route.params.textSearch"
            :inputSearch="this.$route.params.textSearch"></VideoCard>
    </section>
</template>
<script>
import VideoCard from '../components/VideoCard.vue';
import Header from '../components/Header.vue';

import Navigation from '../components/Navigation.vue';
import accountService from '../services/account.service';
import { useAccountStore } from '../store/account';
export default {
    inheritAttrs: false,
    setup() {
        const accountStore = useAccountStore();
        return { accountStore };
    },
    props: {
        inputSearch: '',
    },
    components: {
        Navigation,
        Header,
        VideoCard,
    },
    data() {
        return {
            Account: this.accountStore.account,
        };
    },
    methods: {
        getvalue(route) {
            return route.params.textSearch;
        },
    },
    computed: {},
    mounted() {},
};
</script>
<style scoped></style>
