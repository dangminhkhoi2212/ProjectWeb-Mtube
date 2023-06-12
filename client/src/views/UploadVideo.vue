<template>
    <div class="overflow-auto p-3" style="height: 90vh">
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

                    <VideoController
                        :src="urlVideoLocal"
                        class="mb-3"
                        style="height: 60vh"
                        :autoplay="true"
                        :controls="true" />
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
            v-model:active="isLoading"
            :can-cancel="false"
            backgroundColor="#170f23 !important"
            color="#c6bcd3"
            :opacity="0.6"
            loader="bars"
            :is-full-page="fullPage" />
    </div>
</template>

<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import VideoController from '../components/VideoController.vue';
import { useAccountStore } from '../store/account';
import siteService from '../services/site.service';
import FormData from 'form-data';
import videoService from '../services/video.service';
import alertUtils from '../utils/myAlert';
export default {
    setup() {
        const accountStore = useAccountStore();
        return { accountStore };
    },
    components: {
        VideoController,
        Loading,
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
        };
    },
    methods: {
        onChangeFile(e) {
            this.video = e.target.files[0];
            this.urlVideoLocal = URL.createObjectURL(e.target.files[0]);
            setTimeout(() => {
                this.showOptions = true;
            }, 100);
        },
        async handleUpload() {
            try {
                this.isLoading = true;
                this.fullPage = false;
                var data = JSON.parse(JSON.stringify(this.formData));
                const form = new FormData();
                form.append('accountId', this.accountStore.account._id);
                form.append('publishedAt', siteService.getToDay());
                form.append('channelTitle', this.accountStore.account.name);
                form.append('title', data.title);
                form.append('video', this.video);
                form.append('description', data.description);
                form.append('tags', data.tags);
                form.append('region', data.region);
                form.append('allowComment', data.allowComment);
                form.append('category', data.category);

                await videoService.create(form);
                this.$router.push({ name: 'home' });
                alertUtils.myAlert('success', 'Successfully uploaded video');
                this.isLoading = false;
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
};
</script>

<style scoped></style>
