<template>
    <div>
        <video :src="src"></video>
    </div>
</template>

<script>
export default {
    components: {},
    props: {
        src: '',
    },
    data() {
        return {
            option: {
                controls: [],
                autoplay: true,
            },
        };
    },
    mounted() {},
};
</script>
