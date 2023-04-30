<template>
    <div class="h-100 p-0">
        <div
            class="py-1 text-center rounded-3 fs-5"
            style="background-color: var(--bg_title); color: var(--text_title)">
            Comment
            <i class="fa-regular fa-comments"></i>
        </div>
        <div
            id="comment"
            class="container-fluid overflow-auto m-0 p-0 vl-parent"
            style="height: 75vh; overflow-x: hidden !important">
            <div v-for="(cmt, index) in comments" :key="index" class="">
                <div class="d-flex gap-2 my-2 justify-content-start">
                    <img
                        style="width: 48px; height: 48px"
                        :src="cmt.userImage"
                        class="rounded"
                        alt="..."
                        referrerpolicy="no-referrer" />
                    <p class="fs-5">{{ cmt.userName }}</p>
                </div>
                <p
                    class="text-break"
                    style="white-space: pre-line"
                    :key="index">
                    {{ cmt.textOriginal }}
                </p>
                <p>{{ cmt.publishedAt }}</p>
                <button
                    class="rounded-2"
                    @click="deleteComment(cmt)"
                    v-show="cmt.userId === this.accountStore.account._id"
                    style="">
                    Delete
                </button>
                <hr />
            </div>
            <loading
                v-model:active="isLoading"
                :can-cancel="false"
                backgroundColor="#170f23 !important"
                color="#c6bcd3"
                :opacity="0.8"
                loader="bars"
                :is-full-page="fullPage" />
        </div>
        <div class="input-group mb-2 pt-md-2">
            <input
                type="text"
                class="form-control fs-5 h-100"
                placeholder="Bình luận về video"
                aria-label="Bình luận về video"
                aria-describedby="button-addon2"
                v-model="content"
                @keyup.enter="addComment()" />
            <button
                class="btn btn-outline-secondary"
                data-bs-toggle="modal"
                type="button"
                @click="addComment()">
                <i class="fa-solid fa-paper-plane"></i>
            </button>
        </div>
    </div>
</template>

<script>
import commentService from '../services/comment.service';
import { useAccountStore } from '../store/account';
import { useExtraStore } from '../store/extra';
import site from '../services/site.service';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import Swal from 'sweetalert2';
export default {
    setup() {
        const accountStore = useAccountStore();
        const extraStore = useExtraStore();

        return { accountStore, extraStore };
    },
    props: {
        videoId: { type: String },
    },
    components: { Loading },
    data() {
        return {
            isLoading: false,
            fullPage: false,
            comments: [],
            content: '',
            commentOfUser: {
                videoId: this.videoId,
                userId: this.accountStore.account._id,
                userName: this.accountStore.account.name,
                userImage: this.accountStore.account.image,
                textOriginal: new String(),
                publishedAt: site.getToDay(),
            },
        };
    },

    computed: {},
    methods: {
        async getComments() {
            try {
                this.comments = await commentService.getAll(this.videoId);
            } catch (err) {
                console.log(err);
            }
        },
        async addComment() {
            if (this.commentOfUser.textOriginal.trim().length == 0) {
                return;
            }
            try {
                var comment = document.querySelector('#comment');
                comment.scrollTop = 0;
                this.isLoading = true;
                const newComment = await commentService.create(
                    this.commentOfUser,
                );
                await this.comments.push({ ...newComment });
                this.isLoading = false;
                this.content = '';

                this.keepScroll();
            } catch (err) {
                this.isLoading = false;
                this.extraStore.myAlert('error', 'Error add new comment! 😭');
            }
        },
        async deleteComment(cmt) {
            const confirm = await this.extraStore.myConfirm(
                'Are you sure?',
                'warning',
                "You won't be able to revert this!",
                'Yes, delete it!',
            );
            if (confirm) {
                try {
                    this.isLoading = true;

                    await commentService.delete(cmt._id);
                    for (let i = 0; i < this.comments.length; i++) {
                        if (this.comments[i]._id === cmt._id) {
                            this.comments.splice(i, 1);
                            break;
                        }
                    }
                    this.keepScroll();
                    this.isLoading = false;
                } catch (err) {
                    this.isLoading = false;
                    Swal.fire({
                        position: 'top',
                        icon: 'error',
                        title: 'Error',
                        text: "Can't delete comment! 😭",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                    console.log(err);
                }
            }
        },
        keepScroll() {
            var comment = document.querySelector('#comment');
            comment.scrollTop = comment.scrollHeight;
        },
    },
    watch: {
        content() {
            this.commentOfUser.textOriginal = this.content;
        },
    },
    async mounted() {
        await this.getComments();
    },
};
</script>

<style scoped>
.input-group {
    height: 3rem;
}
.input-group input {
    background-color: var(--bg_input);
    color: var(--text);
    border: none;
    box-shadow: none;
}
.input-group input:focus {
    border: none;
    box-shadow: 0px 0px 6px 2px var(--btn_send);
}
.input-group button {
    background-color: var(--btn_send);
}
button:hover {
    background-color: var(--btn);
    color: var(--text);
}
</style>
