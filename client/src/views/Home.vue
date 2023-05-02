<template>
    <section id="main">
        <ul
            class="px-4 d-flex gap-3 mt-5 mt-sm-0 pt-3 pt-sm-0 overflow-auto vw-100"
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
                :class="{ active_link: region === 'FR' }"
                class="fs-5"
                @click="changeRegion('FR')">
                France
            </li>
            <li>|</li>
            <li
                role="button"
                :class="{ active_link: region === 'RU' }"
                class="fs-5"
                @click="changeRegion('RU')">
                Russia
            </li>
            <li>|</li>
            <li
                role="button"
                :class="{ active_link: region === 'JP' }"
                class="fs-5"
                @click="changeRegion('JP')">
                Japan
            </li>
            <li>|</li>
            <li
                role="button"
                :class="{ active_link: region === 'KR' }"
                class="fs-5"
                @click="changeRegion('KR')">
                Korea
            </li>
            <li>|</li>
            <li
                role="button"
                :class="{ active_link: region === 'TH' }"
                class="fs-5"
                @click="changeRegion('TH')">
                ThaiLand
            </li>
            <li>|</li>
            <li
                role="button"
                :class="{ active_link: region === 'TW' }"
                class="fs-5"
                @click="changeRegion('TW')">
                TaiWan
            </li>
            <li>|</li>
            <li
                role="button"
                :class="{ active_link: region === 'HK' }"
                class="fs-5"
                @click="changeRegion('HK')">
                HongKong
            </li>
        </ul>
        <hr />
        <VideoCard
            :inputSearch="null"
            :key="region"
            :region="region"></VideoCard>
    </section>
</template>
<script>
import VideoCard from '../components/VideoCard.vue';
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
