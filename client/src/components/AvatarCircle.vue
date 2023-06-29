<template>
    <div class="">
        <img class="avatar" :src="src" />
    </div>
</template>

<script>
export default {
    props: {
        src: { type: String },
    },
};
</script>

<style>
img.avatar {
    width: 55px;
    height: 55px;
    border-radius: 50%;
    object-fit: cover;
}
</style>
