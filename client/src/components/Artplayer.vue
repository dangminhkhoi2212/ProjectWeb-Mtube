<template>
    <div
        ref="artRef"
        style="z-index: calc(var(--z_index_nav) - 3) !important"></div>
</template>

<script>
import Artplayer from 'artplayer';

export default {
    data() {
        return {
            instance: null,
        };
    },
    props: {
        option: {
            type: Object,
            required: true,
        },
    },
    mounted() {
        this.instance = new Artplayer({
            ...this.option,
            container: this.$refs.artRef,
        });
    },
    beforeDestroy() {
        if (this.instance && this.instance.destroy) {
            this.instance.destroy(false);
        }
    },
};
</script>
