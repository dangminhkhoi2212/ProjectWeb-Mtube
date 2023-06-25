<template>
    <div class="d-flex align-items-center gap-2">
        <div class="">
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
        <div id="logo" class="" style="width: 35px; height: 40px">
            <RouterLink
                :to="{ name: 'home' }"
                class="d-flex align-items-center gap-2 mx-1 logo"
                style="background-color: transparent !important">
                <img
                    class=""
                    style="width: 40px; height: 40px"
                    src="../assets/images/logo.png"
                    alt="" />
                <span class="d-none d-md-inline fs-5">Mtube</span>
            </RouterLink>
        </div>
    </div>
    <div v-if="isShow" @click="isShow = !isShow" class="space"></div>
    <Navigation
        class="d-sm-flex col-sm-2 nav p-3"
        :class="{ active: isShow }"
        style="z-index: var(--z_index_nav)"></Navigation>
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
