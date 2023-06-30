<template>
    <div class="d-flex gap-3 align-items-center justify-content-center account">
        <div class="p-0 m-0" style="">
            <router-link
                :to="{
                    name: 'profile',
                    params: {
                        accountId: accountId,
                    },
                }">
                <li class="dropdown-item" style="color: var(--text)">
                    <avatar-circle
                        :src="
                            this.accountStore.account.avatar.url
                        "></avatar-circle>
                </li>
            </router-link>
        </div>
        <div class="dropdown">
            <button
                class="dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="true"></button>
            <ul class="dropdown-menu">
                <router-link
                    :to="{
                        name: 'profile',
                        params: {
                            accountId: accountId,
                        },
                        query: {
                            chooseField: 'Videos',
                        },
                    }"
                    ><li class="dropdown-item" style="color: var(--text)">
                        My Videos
                    </li>
                </router-link>

                <router-link
                    :to="{
                        name: 'profile',
                        params: {
                            accountId: accountId,
                        },
                        query: {
                            chooseField: 'About',
                        },
                    }"
                    ><li class="dropdown-item" style="color: var(--text)">
                        About
                    </li>
                </router-link>
                <router-link
                    :to="{
                        name: 'profile',
                        params: {
                            accountId: accountId,
                        },
                        query: {
                            chooseField: 'Settings',
                        },
                    }"
                    ><li class="dropdown-item" style="color: var(--text)">
                        Settings
                    </li>
                </router-link>
                <router-link :to="{ name: 'login' }"
                    ><li
                        @click="removeAccount()"
                        class="dropdown-item"
                        style="color: var(--text)">
                        Log out
                    </li>
                </router-link>
            </ul>
        </div>
    </div>
</template>

<script>
import { useAccountStore } from '../store/account';
import AvatarCircle from './AvatarCircle.vue';
export default {
    setup() {
        const accountStore = useAccountStore();
        return { accountStore };
    },
    props: {
        accountId: { type: String },
    },
    components: { AvatarCircle },
    data() {
        return {};
    },
    methods: {
        async removeAccount() {
            localStorage.clear();
            this.accountStore.account = null;
            // this.$router.push({ name: 'login' });
        },
    },
};
</script>

<style scoped></style>
