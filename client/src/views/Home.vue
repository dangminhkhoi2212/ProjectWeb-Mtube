<template>
    <section id="main">
        <ul
            class="px-4 d-flex gap-3 mt-5 mt-sm-0 overflow-auto vw-100"
            style="white-space: nowrap; width: 100vw">
            <li
                role="button"
                :class="{ active_link: region === 'VN' }"
                class="fs-5"
                @click="changeRegion('VN')">
                VietNam
            </li>
            <li>|</li>
            <li
                role="button"
                :class="{ active_link: region === 'US' }"
                class="fs-5"
                @click="changeRegion('US')">
                United Kingdom
            </li>
            <li>|</li>
            <li
                role="button"
                :class="{ active_link: region === 'KR' }"
                class="fs-5"
                @click="changeRegion('KR')">
                Korea
            </li>
        </ul>
        <VideoCard
            :inputSearch="null"
            :key="region"
            :region="region"></VideoCard>
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
        VideoCard,
    },
    data() {
        return {
            region: 'VN',
        };
    },
    methods: {
        changeRegion(region) {
            this.region = region;
            console.log(this.region);
        },
    },
    computed: {},
    async mounted() {},
};
</script>
<style scoped>
.active_link {
    border-radius: 2rem;
    border-bottom: 2px solid var(--border);
    transition: all 0.2s linear;
}
ul li:hover {
    border-bottom: 2px solid var(--border);
}
ul::-webkit-scrollbar {
    display: none;
}
</style>
