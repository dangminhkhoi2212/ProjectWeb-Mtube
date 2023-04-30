<template>
    <main
        id="main"
        class="row d-flex justify-content-center align-items-center my-3"
        style="height: 90vh">
        <div
            class="rounded-4 p-4 col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4 overflow-auto"
            style="backdrop-filter: blur(25px); height: 80vh">
            <div class="row">
                <div
                    class="mx-auto mt-2"
                    style="width: 10rem; max-height: 10rem">
                    <img
                        class="w-100 h-100 rounded-5 img-fluid"
                        :src="urlImage"
                        style="object-fit: cover" />
                </div>
                <FormKit
                    type="form"
                    @submit="updateAccount"
                    :actions="false"
                    #default="{ value }">
                    <FormKit
                        label="Name"
                        type="text"
                        validation="length:5"
                        validation-visibility="live"
                        placeholder="Your full name"
                        v-model="account.name" />
                    <FormKit
                        label="Username"
                        type="text"
                        validation="matches:/^[a-z0-9]+$/|length:5"
                        validation-visibility="live"
                        placeholder="Your username"
                        v-model="account.username" />
                    <FormKit
                        type="email"
                        label="Email address"
                        validation="email"
                        validation-visibility="live"
                        placeholder="Your email"
                        v-model="account.email" />
                    <div class="m-2 w-50 d-flex align-items-center">
                        <input
                            type="checkbox"
                            id="changePassword"
                            style="width: 1.5rem; height: 1.5rem"
                            v-model="changePassword" />
                        <label for="changePassword" class="m-2"
                            >Change Password</label
                        >
                    </div>
                    <div v-if="changePassword">
                        <FormKit
                            type="password"
                            name="password"
                            value="super-secret"
                            label="Password"
                            help="Enter a new password"
                            validation-visibility="live"
                            v-model="newpassword" />
                        <FormKit
                            type="password"
                            name="password_confirm"
                            label="Confirm password"
                            help="Confirm your new password"
                            validation="confirm"
                            validation-visibility="live"
                            validation-label="Password confirmation" />
                    </div>
                    <div class="col-12">
                        <div class="m-2 w-50 d-flex align-items-center">
                            <input
                                type="checkbox"
                                id="changeAvatar"
                                style="width: 1.5rem; height: 1.5rem"
                                v-model="changeAvtar" />
                            <label for="changeAvatar" class="m-2"
                                >Change Avatar</label
                            >
                        </div>
                        <input
                            v-if="changeAvtar"
                            type="file"
                            @change="onFileSelected" />
                    </div>

                    <div class="d-flex justify-content-center">
                        <button
                            class="submit col-md-6 rounded-2 px-4 my-2"
                            type="submit">
                            Save
                        </button>
                    </div>
                </FormKit>
            </div>
        </div>
    </main>
    <div class="vl-parent">
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
import axios from 'axios';
import FormData from 'form-data';
import Navigation from '../components/Navigation.vue';
import accountService from '../services/account.service';
import { useAccountStore } from '../store/account';
import { useExtraStore } from '../store/extra';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
export default {
    setup() {
        const accountStore = useAccountStore();
        const extraStore = useExtraStore();
        return { accountStore, extraStore };
    },
    data() {
        return {
            message: '',
            account: this.accountStore.account,
            newimage: '',
            newpassword: '',
            changeAvtar: false,
            changePassword: false,
            urlImage: this.accountStore.account.image,
            isLoading: true,
            fullPage: true,
            onCancel: false,
        };
    },
    components: {
        Navigation,
        Loading,
    },
    methods: {
        onFileSelected(event) {
            if (event) {
                this.newimage = event.target.files[0];
                this.urlImage = URL.createObjectURL(event.target.files[0]);
            }
        },
        newAccount() {
            const form = new FormData();
            form.append('name', this.account.name);
            form.append('username', this.account.username);
            form.append('email', this.account.email);
            if (this.changePassword) form.append('password', this.newpassword);
            if (this.changeAvtar) form.append('image', this.newimage);

            return form;
        },
        async updateAccount() {
            var form = this.newAccount();
            const url_local = 'http://localhost:3000';

            try {
                this.isLoading = true;
                this.fullPage = true;
                await axios.put(
                    `${url_local}/account/${this.account._id}`,
                    form,
                );
                await this.accountStore.refresh();
                this.isLoading = false;
                this.extraStore.myAlert('success', ' Updated successfully 🥳');
            } catch (err) {
                this.isLoading = false;
                this.extraStore.myAlert(
                    'error',
                    'An error has occurred!\nTry again. 😭',
                );
            }
        },
    },
    mounted() {
        this.isLoading = false;
        this.fullPage = false;
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
