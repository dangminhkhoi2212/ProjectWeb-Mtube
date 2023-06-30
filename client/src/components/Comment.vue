<template>
    <div class="" style="background-color: var(--background_main)">
        <p class="fs-5">{{ comments.length }} comments</p>
        <div class="input-group my-4 pt-md-2 d-flex align-items-center">
            <router-link
                v-if="accountStore.account._id"
                :to="{
                    name: 'profile',
                    params: { accountId: accountStore.account._id },
                }">
                <AvatarCircle
                    class="mx-3"
                    :src="accountStore.account.avatar.url"></AvatarCircle>
            </router-link>
            <textarea
                type="text"
                class="form-control rounded-3 me-2 h-100 fs-5"
                placeholder="Add a comment..."
                aria-label="Bình luận về video"
                v-model="content"
                @keydown="handleComment"></textarea>
            <button
                class="rounded-1 h-100 text-center"
                data-bs-toggle="modal"
                type="button"
                @click="addComment()">
                <i class="fa-solid fa-paper-plane p-2"></i>
            </button>
        </div>
        <div
            id="comment"
            class="container-fluid overflow-auto m-0 p-0 vl-parent"
            style="overflow-x: hidden !important">
            <div
                v-for="(cmt, index) in comments"
                :key="index"
                class="row align-items-center">
                <div class="p-0 position-relative">
                    <div class="col-10 col-sm-11">
                        <router-link
                            v-if="cmt.accountId"
                            :to="{
                                name: 'profile',
                                params: { accountId: cmt.accountId._id },
                            }"
                            class="d-flex gap-2 my-2 align-items-center">
                            <AvatarCircle
                                :src="cmt.accountId.avatar.url"></AvatarCircle>
                            <div
                                class="d-flex flex-column flex-sm-row align-items-start justify-content-center gap-sm-3">
                                <div
                                    class="d-flex flex-column justify-content-start">
                                    <span
                                        class="fs-sm-5 px-2 rounded-5"
                                        :class="
                                            cmt.accountId._id === this.accountId
                                                ? 'isAccount'
                                                : ''
                                        ">
                                        {{ cmt.accountId.name }}
                                    </span>
                                    <span
                                        class="px-2"
                                        style="
                                            color: var(--text_white_50);
                                            font-size: 0.8rem;
                                            font-weight: 300;
                                        ">
                                        {{
                                            cmt.accountId.followers.length.toLocaleString(
                                                'en-US',
                                            )
                                        }}
                                        followers
                                    </span>
                                </div>
                                <p
                                    class="px-2 m-0 fw-light"
                                    style="font-size: 0.8rem"
                                    v-if="cmt.publishedAt">
                                    {{ cmt.publishedAt }}
                                </p>
                            </div>
                        </router-link>
                        <p
                            class="text-break my-2"
                            style="white-space: pre-line"
                            :key="index">
                            {{ cmt.textOriginal }}
                        </p>
                    </div>

                    <button
                        v-if="
                            accountId === this.accountStore.account._id ||
                            cmt.accountId._id == accountStore.account._id
                        "
                        class="rounded-2 p-0 position-absolute top-50 end-0 translate-middle-y"
                        @click="deleteComment(cmt)"
                        style="height: 30px; width: 40px">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                <hr class="m-0" />
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
    </div>
</template>

<script>
import commentService from '../services/comment.service';
import { useAccountStore } from '../store/account';
import { useExtraStore } from '../store/extra';
import { getToDay, convertISOTime, convertISODate } from '../utils/date.utils';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import Swal from 'sweetalert2';
import AvatarCircle from './AvatarCircle.vue';
export default {
    setup() {
        const accountStore = useAccountStore();
        const extraStore = useExtraStore();

        return { accountStore, extraStore };
    },
    props: {
        video: { type: Object },
        accountId: { type: String },
    },
    components: { Loading, AvatarCircle },
    data() {
        return {
            isLoading: false,
            fullPage: false,
            comments: [],
            content: '',
            commentOfUser: {
                videoId: this.video._id,
                accountId: this.accountStore.account._id,
                textOriginal: '',
                publishedAt: getToDay(),
            },
        };
    },

    computed: {},
    methods: {
        async getComments() {
            try {
                this.comments = (
                    await commentService.getAll(this.video._id)
                ).map((cmt) => {
                    const time = `${convertISOTime(
                        cmt.publishedAt,
                    )}, ${convertISODate(cmt.publishedAt)}`;

                    return { ...cmt, publishedAt: time };
                });
            } catch (err) {
                console.log(err);
            }
        },
        async handleComment(event) {
            if (event.key === 'Enter' && event.shiftKey) {
                // Handle Shift + Enter (add line break)
                this.content += '\n';
                event.preventDefault(); // Prevents the default behavior (submitting the form)
            } else if (event.key === 'Enter') {
                // Handle Enter (submit comment)
                await this.addComment();
            }
        },
        async addComment() {
            try {
                if (this.commentOfUser.textOriginal.trim().length == 0) {
                    return;
                }
                this.isLoading = true;
                await commentService.create(this.commentOfUser);
                await this.getComments();
                this.isLoading = false;
                this.content = '';

                this.keepScroll();
            } catch (error) {
                console.log(
                    '🚀 ~ file: Comment.vue:184 ~ addComment ~ err:',
                    error,
                );
                this.isLoading = false;
                this.extraStore.myAlert(
                    'error',
                    error.response.data.message || 'Add comment failed!',
                );
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
                }
            }
        },
        keepScroll() {
            var comment = document.querySelector('#main');
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
.isAccount {
    background-color: var(--text_title);
}
.input-group {
    height: 3rem;
}
.input-group textarea {
    background-color: var(--bg_input);
    color: var(--text);
    border: none;
    box-shadow: none;
    resize: none;
}
.input-group textarea:focus {
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
::-webkit-scrollbar {
    display: none;
}
</style>
