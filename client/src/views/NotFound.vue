<template>
    <div
        id="main"
        class="page vh-100 fixed-top d-flex align-items-center justify-content-end">
        <p class="fs-3" style="color: var(--); transform: translateX(-50%)">
            Oops, don't find website. Go to
            <router-link to="/">Home</router-link>
        </p>
    </div>
</template>
<script></script>
<style scoped>
#main {
    background-image: url(../assets/images/not_found.jpg);
    background-repeat: no-repeat;
    background-size: contain;
}
a {
    text-decoration: none !important;
}
</style>
