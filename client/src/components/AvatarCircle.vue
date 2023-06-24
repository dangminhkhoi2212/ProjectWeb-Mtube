<template>
    <div>
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
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
}
</style>
