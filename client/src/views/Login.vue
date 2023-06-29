<template>
    <div class="page vh-100 vw-100">
        <div
            id="main"
            class="w-100 h-100 d-flex justify-content-center align-items-center">
            <div
                class="rounded-4 my-sm-5 p-4 col-12 col-sm-10 col-md-8 col-lg-6 col-xxl-4 vh-90 overflow-auto"
                style="backdrop-filter: blur(50px)">
                <div class="mx-auto" style="width: 30%; height: 30%">
                    <h1>Login</h1>
                </div>
                <div class="row">
                    <FormKit type="form" @submit="gotoHome()" :actions="false">
                        <FormKit
                            label="Username"
                            type="text"
                            validation="required|length:5"
                            placeholder="Your username"
                            v-model="username" />
                        <FormKit
                            type="password"
                            name="password"
                            value="super-secret"
                            label="Password"
                            help="Enter a new password"
                            validation="required"
                            placeholder="Your password"
                            v-model="password" />
                        <button
                            class="submit col-md-6 offset-md-3 rounded-2 py-1 my-2"
                            type="submit">
                            Login
                        </button>
                    </FormKit>
                    <div class="d-flex justify-content-center">
                        <p>
                            If you don't have accout,
                            <router-link
                                :to="{ name: 'register' }"
                                class="fs-4 px-2 rounded-2"
                                style="
                                    color: var(--text);
                                    background-color: var(--btn);
                                ">
                                Register
                            </router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <Loading
            v-model:active="loading.isLoading"
            :can-cancel="loading.onCancel"
            :is-full-page="loading.fullPage"
            :opacity="1"
            backgroundColor="#170f23 !important"
            color="#c6bcd3"
            loader="bars" />
    </div>
</template>
<script>
import accountService from '../services/account.service';
import { useAccountStore } from '../store/account';
import { useExtraStore } from '../store/extra';
import alertUtil from '../utils/myAlert';
import { loginRest } from '../services/ChatEngine';
import Loading from 'vue-loading-overlay';
export default {
    setup() {
        const accountStore = useAccountStore();
        const extraStore = useExtraStore();
        return { accountStore, extraStore };
    },
    data() {
        return {
            username: '',
            password: '',
            account: {},
            message: '',
            loading: {
                isLoading: false,
                isFullPage: true,
                onCancel: false,
            },
        };
    },
    components: { Loading },
    methods: {
        async gotoHome() {
            try {
                this.loading.isLoading = true;

                this.account = await accountService.getLogin(
                    this.username,
                    this.password,
                );
                if (!this.account || Object.keys(this.account).length === 0) {
                    alertUtil.myAlert('error', "Don't find your account!");
                    return;
                }
                localStorage.removeItem('id');
                localStorage.setItem('id', this.account._id);
                this.accountStore.account = this.account;
                localStorage.setItem('token', this.account.token);

                // Login in ChatEngine
                await loginRest('@' + this.username, this.account._id);
                this.loading.isLoading = false;
                this.$router.push({ name: 'home' });
            } catch (err) {
                this.loading.isLoading = false;

                alertUtil.myAlert('error', err.response.data.message);
            }
        },
    },
    mounted() {
        this.accountStore.removeAccount();
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
}
</style>
