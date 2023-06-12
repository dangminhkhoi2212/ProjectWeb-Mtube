<template>
    <section id="main" class="overflow-y">
        <VideoCard class="px-lg-5" :inputSearch="null"></VideoCard>
    </section>
</template>
<script>
import VideoCard from '../components/VideoCard.vue';
import Header from '../components/Header.vue';

import Navigation from '../components/Navigation.vue';
import accountService from '../services/account.service';
import { useAccountStore } from '../store/account';
import { useVideoStore } from '../store/video';
export default {
    setup() {
        const accountStore = useAccountStore();
        const videoStore = useVideoStore();
        return { accountStore, videoStore };
    },
    components: {
        Navigation,
        Header,
        VideoCard,
    },
    data() {
        return {
            Account: this.accountStore.account,
            myVideos: true,
        };
    },
    methods: {},
    computed: {},
    mounted() {},
};
</script>
<style scoped></style>
