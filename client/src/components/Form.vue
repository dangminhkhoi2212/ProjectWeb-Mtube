<template>
    <div class="row">
        <div class="col-sm-8 overflow-auto" style="height: 88vh">
            <div
                class=""
                style="height: 50vh !important"
                v-html="video.frame"></div>
            <div class="ms-2">
                <p class="p-3 fs-2">
                    {{ video.title }}
                </p>
                <hr />
                <div class="">
                    <p class="fs-3">
                        <i
                            class="fa-solid fa-house-fire"
                            style="color: var(--text_title)"></i
                        >&nbsp;
                        {{ video.channelTitle }}
                    </p>

                    <div
                        class="w-100 d-flex flex-wrap justify-content-around align-items-center my-4 gap-2">
                        <div class="btn-reacte rounded-4 fs-5">
                            <i class="fa-solid fa-eye"></i>&nbsp;
                            {{ video.viewCount }}
                        </div>
                        <div class="btn-reacte rounded-4 fs-5">
                            <i class="fa-solid fa-heart"></i>&nbsp;
                            {{ video.likeCount }}
                        </div>
                        <div class="btn-reacte rounded-4 fs-5">
                            <i class="fa-solid fa-folder-plus"></i>&nbsp; Add
                            video
                        </div>
                    </div>
                    <p class="">
                        <i class="fa-solid fa-calendar-days"></i>&nbsp;
                        {{ video.publishedAt }}
                    </p>
                    <p style="white-space: pre-line">
                        {{ video.description }}
                    </p>
                </div>
            </div>
        </div>
        <!-- add :key to refresh component -->
        <div class="col-sm-4">
            <Comment :key="video.videoId" :videoId="video.videoId"></Comment>
        </div>
    </div>
</template>
<script>
import videoService from '../services/video.service';
import Navigation from '../components/Navigation.vue';
import Comment from '../components/Comment.vue';
import Header from '../components/Header.vue';

export default {
    components: {
        Navigation,
        Header,
        Comment,
    },
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            video: {
                type: Object,
            },
        };
    },
    methods: {
        async getVideo(id) {
            try {
                this.video = await videoService.get(id);
                this.format;
            } catch (err) {
                console.log(err);
                this.$router.push({
                    name: 'notfound',
                    params: {
                        pathMatch: this.$route.path.split('/').slice(1),
                    },
                    query: this.$route.query,
                    hash: this.$route.hash,
                });
            }
        },
    },
    computed: {
        format() {
            this.video.likeCount = this.video.likeCount.toLocaleString('en-US');
            this.video.viewCount = this.video.viewCount.toLocaleString('en-US');
        },
    },
    mounted() {
        this.getVideo(this.id);
        console.log(this.id);
    },
};
</script>
<style scoped>
.btn-reacte {
    background-color: var(--btn);
    color: var(--text);
    transition: all 0.2s linear;
    padding: 1rem 2rem;
}
.btn-reacte:hover {
    box-shadow: 0 0 30px 4px var(--btn_hover);
}
</style>
