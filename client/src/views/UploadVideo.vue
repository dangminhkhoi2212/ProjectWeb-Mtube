<template>
    <div
        class="row justify-content-center align-items-center p-3 main_container vl-parent">
        <FormKit
            type="form"
            v-model="formData"
            :actions="false"
            @submit="handleUpload()">
            <div class="row gap-2 justify-content-center align-items-center">
                <div
                    class="col-12 col-xl-5 rounded-2 p-3 d-flex flex-column justify-content-center align-items-center"
                    style="background-color: var(--bg_form)">
                    <img
                        v-if="!showOptions"
                        src="../assets/images/upload_illustration.svg"
                        alt="" />
                    <Artplayer
                        :key="urlVideoLocal"
                        v-else
                        :option="{ ...option, url: urlVideoLocal }"
                        class="mb-3 overflow-hidden"
                        :style="{
                            height: '60vh',
                            width: '100%',
                            borderRadius: 'var(--border_radius_video)',
                        }"></Artplayer>
                    <FormKit
                        type="file"
                        label="Select a video as you would like"
                        accept=".mp4"
                        name="file"
                        multiple="false"
                        help="Note: File size is less than 10MB"
                        @change="onChangeFile" />
                </div>
                <div
                    v-if="showOptions"
                    class="col-12 col-xl-5 rounded-2 d-flex justify-content-center align-items-center"
                    style="background-color: var(--bg_form)">
                    <div class="p-3" style="width: 90%">
                        <h2>Detail</h2>
                        <FormKit
                            type="text"
                            name="title"
                            label="Title"
                            validation="required"
                            maxlength="200"
                            v-model="title" />
                        <FormKit
                            type="textarea"
                            name="description"
                            rows="10"
                            label="Description"
                            placeholder="Enter your description..." />
                        <FormKit
                            type="select"
                            label="Which category is this video?"
                            name="category"
                            :options="[
                                'Cars and vehicles',
                                'Comedy',
                                'Education',
                                'Film and animation',
                                'Gaming',
                                'How-to and style',
                                'Music',
                                'News and politics',
                                'Non-profits and activism',
                                'People and blogs',
                                'Pets and animals',
                                'Science and technology',
                                'Sport',
                                'Travel and events',
                            ]" />
                        <FormKit
                            type="text"
                            name="region"
                            label="Region"
                            value="VN"
                            validation="required"
                            maxlength="2"
                            placeholder="Ex: 'VietNam' -> 'VN'" />
                        <FormKit
                            type="textarea"
                            name="tags"
                            label="Tags"
                            maxlength="500"
                            placeholder="Ex: title1,title2,..." />
                        <FormKit
                            type="checkbox"
                            label="Allow comment"
                            name="allowComment"
                            :value="true"
                            validation-visibility="dirty" />
                        <button
                            stype="submit "
                            class="col-4 py-2 rounded-3"
                            style="
                                background-color: var(--btn);
                                color: var(--text);
                            ">
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        </FormKit>
        <loading
            v-model:active="loading.isLoading"
            :can-cancel="false"
            backgroundColor="#170f23 !important"
            color="#c6bcd3"
            :opacity="0.6"
            loader="bars"
            :is-full-page="loading.isFullPage" />
    </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import VideoController from '../components/VideoController.vue';
import { useAccountStore } from '../store/account';
import { getToDay, convertISOTime } from '../utils/date.utils';
import FormData from 'form-data';
import videoService from '../services/video.service';
import alertUtils from '../utils/myAlert';
import Artplayer from '../components/Artplayer.vue';
import { option } from 'artplayer';
export default {
    setup() {
        const accountStore = useAccountStore();
        return { accountStore };
    },
    components: {
        VideoController,
        Loading,
        Artplayer,
    },
    data() {
        return {
            urlVideoLocal: '',
            title: '',
            formData: {},
            video: null,
            isLoading: false,
            fullPage: true,
            onCancel: false,
            showOptions: false,
            option: {
                autoplay: false,
                pip: true,
                screenshot: true,
                setting: true,
                loop: false,
                flip: true,
                playbackRate: true,
                aspectRatio: true,
                fullscreen: true,
                fullscreenWeb: true,
                subtitleOffset: true,
                miniProgressBar: true,
                mutex: true,
                backdrop: true,
                playsInline: true,
                autoPlayback: true,
                airplay: true,
                theme: '#4e2a7d',
            },
            loading: {
                isLoading: false,
                isFullPage: false,
                onCancel: false,
            },
        };
    },
    methods: {
        onChangeFile(e) {
            this.video = e.target.files[0];
            URL.revokeObjectURL(this.urlVideoLocal);
            this.urlVideoLocal = URL.createObjectURL(e.target.files[0]);
            setTimeout(() => {
                this.showOptions = true;
            }, 100);
        },
        async handleUpload() {
            try {
                this.loading.isLoading = true;
                this.loading.isFullPage = false;
                var data = JSON.parse(JSON.stringify(this.formData));
                data.tags = data.tags.split(',');
                data.tags = data.tags.map((tags) => tags.trim());

                const form = new FormData();
                form.append('accountId', this.accountStore.account._id);
                form.append('publishedAt', getToDay());
                form.append('channelTitle', this.accountStore.account.name);
                form.append('title', data.title.trim());
                form.append('video', this.video);
                form.append('description', data.description);
                form.append('tags', data.tags);
                form.append('region', data.region);
                form.append('allowComment', data.allowComment);
                form.append('category', data.category);

                await videoService.create(form);

                alertUtils.myAlert('success', 'Successfully uploaded video');
                this.loading.isLoading = false;
                URL.revokeObjectURL(this.urlVideoLocal);

                this.$router.push({ name: 'home' });
            } catch (error) {
                console.error(error);
                alertUtils.myAlert(
                    'error',
                    error.response.data.message || error.message,
                );
                this.isLoading = false;
            }
        },
    },
    mounted() {},
};
</script>

<style>
.main_container {
    background-image: url('../assets/images/background_videoUpload.png');
    background-size: cover;
    height: calc(100vh - var(--height_header));
    overflow-y: auto;
}
</style>
