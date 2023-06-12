<template>
    <section id="main">
        <Carousel v-model="categoryActive"></Carousel>
        <VideoCard
            :inputSearch="null"
            :key="categoryActive"
            :category="categoryActive"></VideoCard>
    </section>
</template>
<script>
import VideoCard from '../components/VideoCard.vue';
import { useAccountStore } from '../store/account';
import { useVideoStore } from '../store/video';
import Carousel from '../components/Carousel.vue';
export default {
    setup() {
        const accountStore = useAccountStore();
        const videoStore = useVideoStore();
        return { accountStore, videoStore };
    },
    components: {
        VideoCard,
        Carousel,
    },

    data() {
        return { categoryActive: 'All' };
    },
    methods: {},
    computed: {},
    mounted() {
        console.log(this.categoryActive);
    },
};
</script>
<style scoped>
.active_link {
    background-color: var(--btn);
}

ul li {
    padding: 0.3rem 0.6rem;
    background-color: var(--btn_hover);
}
ul li:hover {
    background-color: var(--btn);
}
ul {
    overflow-x: scroll;
    white-space: nowrap;
}

ul::-webkit-scrollbar {
    width: 8px;
}

ul::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
}

ul::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.7);
}

ul::-webkit-scrollbar-track {
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
}
</style>
