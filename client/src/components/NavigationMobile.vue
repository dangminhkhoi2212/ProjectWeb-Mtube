<template>
    <div
        v-if="this.$route.name === 'detail'"
        class="d-flex align-items-center gap-5 sticky-top">
        <div>
            <i
                v-if="!isShow"
                role="button"
                @click="isShow = !isShow"
                class="fs-4 fa-solid fa-bars"></i>
            <i
                v-else
                role="button"
                @click="isShow = !isShow"
                class="fs-4 fa-solid fa-x"></i>
        </div>
        <div
            v-if="!isShow"
            id="logo"
            class=""
            style="width: 35px; height: 40px">
            <RouterLink :to="{ name: 'home' }" class="logo">
                <img
                    style="width: 40px; height: 40px"
                    src="../assets/images/logo.png"
                    alt="" />
            </RouterLink>
        </div>
    </div>
    <div
        v-if="isShow"
        @click="isShow = !isShow"
        class="vw-100 p-0 m-0 position-absolute"
        style="
            top: 69px;

            background-color: var(--space_cover);
            height: calc(100vh - var(--width_header));
        "></div>
    <Navigation
        v-if="this.$route.name === 'detail'"
        class="d-sm-flex col-sm-2 nav z-10000"
        :class="{ active: isShow }"></Navigation>
</template>

<script>
import Navigation from './Navigation.vue';

export default {
    data() {
        return { isShow: false };
    },
    mounted() {
        this.isShow = false;
    },
    components: { Navigation },
};
</script>

<style scoped>
.nav {
    position: absolute;
    top: 69px;
    left: 0;
    height: calc(100vh - var(--width_header));
    transform: translateX(-300%);
    transition: all 0.2s linear;
}
.nav.active {
    transform: translateX(0);
}
</style>
