<template>
    <div
        class="row justify-content-center align-items-center p-3 main_container">
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
                        :key="formData.videoUpload.url"
                        v-else
                        :option="{ ...option, url: formData.videoUpload.url }"
                        class="mb-3 overflow-hidden"
                        :style="{
                            height: '60vh',
                            width: '100%',
                            borderRadius: 'var(--border_radius_video)',
                        }"></Artplayer>
                    <FormKit
                        v-if="!this.formData._id"
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
                            <span v-if="this.formData._id">Save</span>
                            <span v-else>Upload</span>
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
    props: {
        videoEdit: { type: Object },
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
            formData: {
                videoUpload: {
                    url: '',
                },
            },
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

            URL.revokeObjectURL(this.formData.videoUpload.url);
            this.formData.videoUpload.url = URL.createObjectURL(
                e.target.files[0],
            );
            setTimeout(() => {
                this.showOptions = true;
            }, 100);
        },
        async handleUpload() {
            try {
                if (this.formData._id) {
                    this.handleEdit();
                    return;
                }
                this.loading.isLoading = true;
                var data = JSON.parse(JSON.stringify(this.formData));
                if ('tags' in data) {
                    data.tags = data.tags.split(',');
                    data.tags = data.tags.filter((tags) => tags.trim() !== '');
                    data.tags.forEach((tags) => {
                        console.log(
                            '🚀 ~ file: UploadVideo.vue:197 ~ data.tags.forEach ~ tags:',
                            tags,
                        );
                    });
                }

                const form = new FormData();
                form.append('accountId', this.accountStore.account._id);
                form.append('publishedAt', getToDay());
                form.append('channelTitle', this.accountStore.account.name);
                form.append('title', data.title.trim());
                form.append('video', this.video);
                if (data.description)
                    form.append('description', data.description);
                if (data.tags) {
                    for (let i = 0; i < data.tags.length; i++) {
                        form.append(`tags[${i}]`, data.tags[i]);
                    }
                }
                form.append('region', data.region);
                form.append('allowComment', data.allowComment);
                form.append('category', data.category);

                await videoService.create(form);

                this.loading.isLoading = false;
                alertUtils.myAlert('success', 'Successfully uploaded video');
                URL.revokeObjectURL(this.formData.videoUpload.url);

                this.$router.push({ name: 'home' });
            } catch (error) {
                alertUtils.myAlert(
                    'error',
                    error.response.data.message || 'Reload page and try again',
                );

                this.loading.isLoading = false;
            }
        },
        async handleEdit() {
            try {
                this.loading.isLoading = true;
                await videoService.update(this.formData._id, this.formData);
                this.loading.isLoading = false;
                alertUtils.myAlert('success', 'Successfully Edit video');
                this.$router.push({
                    name: 'detail',
                    params: { id: this.formData._id },
                });
            } catch (error) {
                alertUtils.myAlert(
                    'error',
                    error.response.data.message || error.message,
                );
                this.loading.isLoading = false;
            }
        },
    },
    mounted() {
        if (this.$route.query.videoEdit) {
            this.formData = JSON.parse(this.$route.query.videoEdit);

            this.showOptions = true;
        }
    },
};
</script>

<style>
.main_container {
    background-image: url('../assets/images/background_videoUpload.png');
    background-size: cover;
    height: calc(100vh - var(--height_header));
    overflow-y: auto;
}
[data-type='checkbox'] .formkit-input ~ .formkit-decorator,
[data-type='radio'] .formkit-input ~ .formkit-decorator,
[data-type='checkbox'] .formkit-input:focus ~ .formkit-decorator,
[data-type='checkbox'] .formkit-input:checked ~ .formkit-decorator,
[data-type='radio'] .formkit-input:checked ~ .formkit-decorator {
    box-shadow: 0 0 2px 2px var(--btn_hover);
}

[data-type='checkbox'] .formkit-input:checked ~ .formkit-decorator {
    box-shadow: 0;
}
[data-type='checkbox']
    .formkit-input:checked
    ~ .formkit-decorator
    .formkit-icon {
    color: var(--text) !important;
}
</style>
