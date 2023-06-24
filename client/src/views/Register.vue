<template>
    <div class="page row vh-100 fixed-top">
        <div
            id="main"
            class="pt-lg-0 col-sm-12 d-flex justify-content-center align-items-center vh-100">
            <div
                class="rounded-4 p-4 col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4 overflow-auto"
                style="backdrop-filter: blur(50px); height: 90%">
                <div class="mx-auto" style="width: 30%">
                    <h1>Resigter</h1>
                </div>
                <div class="row">
                    <FormKit
                        type="form"
                        @submit="register()"
                        :actions="false"
                        #default="{ value }">
                        <FormKit
                            label="Name"
                            type="text"
                            validation="required|length:5"
                            validation-visibility="live"
                            placeholder="Your full name"
                            v-model="account.name"
                            enctype="multipart/form-data" />
                        <FormKit
                            label="Username"
                            type="text"
                            validation="required|matches:/^[a-z0-9]+$/|length:5"
                            validation-visibility="live"
                            placeholder="Your username"
                            v-model="account.username" />
                        <FormKit
                            type="email"
                            label="Email address"
                            validation="required|email"
                            validation-visibility="live"
                            placeholder="Your email"
                            v-model="account.email" />
                        <FormKit
                            type="password"
                            name="password"
                            value="super-secret"
                            label="Enter a new password"
                            validation="required"
                            validation-visibility="live"
                            v-model="account.password" />
                        <FormKit
                            type="password"
                            name="password_confirm"
                            label="Confirm password"
                            validation="required|confirm"
                            validation-visibility="live"
                            validation-label="Password confirmation" />
                        <FormKit
                            type="file"
                            label="Select a avatar as you would like"
                            accept=".jpg,.png"
                            name="file"
                            multiple="false"
                            @change="onFileSelected" />

                        <div class="d-flex justify-content-center">
                            <img
                                v-if="urlImage"
                                :src="urlImage"
                                id="avatar"
                                class="m-3 rounded-4"
                                style="
                                    width: 15rem;
                                    height: 15rem;
                                    object-fit: cover;
                                " />
                        </div>

                        <button
                            class="submit col-md-6 offset-md-3 rounded-2 py-1 my-2"
                            type="submit">
                            Create
                        </button>
                    </FormKit>
                    <div class="d-flex justify-content-center">
                        <p>
                            If you have an accout,
                            <router-link
                                :to="{ name: 'login' }"
                                class="fs-4 px-2 rounded-2"
                                style="
                                    color: var(--text);
                                    background-color: var(--btn);
                                ">
                                Login
                            </router-link>
                        </p>
                    </div>
                </div>
            </div>
            <div class="vl-parent">
                <loading
                    v-model:active="isLoading"
                    :can-cancel="false"
                    loader="bars"
                    backgroundColor="#170f23 !important"
                    :is-full-page="fullPage" />
            </div>
        </div>
    </div>
</template>
<script>
import FormData from 'form-data';
import accountService from '../services/account.service';
import { useAccountStore } from '../store/account';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { useExtraStore } from '../store/extra';

export default {
    setup() {
        const accountStore = useAccountStore();
        const extraStore = useExtraStore();
        return { accountStore, extraStore };
    },
    data() {
        return {
            account: {
                name: '',
                username: '',
                password: '',
                email: '',
                image: '',
            },
            isLoading: false,
            fullPage: true,
            urlImage: null,
        };
    },
    components: {
        Loading,
    },
    methods: {
        onFileSelected(event) {
            this.account.image = event.target.files[0];
            if (event.target.files[0])
                this.urlImage = URL.createObjectURL(event.target.files[0]);
        },
        async checkNewAccount(username, email) {
            var flag = true;

            try {
                const accountExist = JSON.parse(
                    JSON.stringify(await accountService.getAll()),
                );
                for (let i = 0; i < accountExist.data.length; i++) {
                    if (accountExist.data[i].username === username) {
                        flag = false;
                        this.extraStore.myAlert('error', 'Username exist 😭!');
                        break;
                    }
                    if (accountExist.data[i].email === email) {
                        flag = false;
                        this.extraStore.myAlert('error', 'Email exist 😭!');
                        break;
                    }
                }
            } catch (err) {
                console.log(err);
            }
            return flag;
        },
        async register() {
            try {
                this.isLoading = true;

                const form = new FormData();
                form.append('name', this.account.name);
                form.append('username', this.account.username);
                form.append('password', this.account.password);
                form.append('email', this.account.email);
                if (this.urlImage) form.append('avatar', this.account.image);

                await accountService.create(form);
                this.isLoading = false;
                this.extraStore.myAlert('success', 'Create success! 🥳');
                URL.revokeObjectURL(this.urlImage);
                this.$router.push({ name: 'login' });
            } catch (error) {
                console.log(
                    '🚀 ~ file: Register.vue:187 ~ register ~ error:',
                    error,
                );
                this.isLoading = false;
                this.extraStore.myAlert(
                    'error',
                    error.response.data.message || error.message,
                );
            }
        },
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
.submit:hover {
    background-color: var(--btn);
    color: var(--text);
}
#main {
    background-image: url('../assets/images/bg_account_edit.jpg') !important;
    background-repeat: no-repeat;
}
</style>
