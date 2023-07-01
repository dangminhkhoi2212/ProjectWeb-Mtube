<template>
    <div
        class=""
        style="
            height: var(--height_header);
            background-color: var(--background_main);
            z-index: calc(var(--z_index_nav) - 1);
        ">
        <div
            class="d-flex align-items-center justify-content-between justify-content-sm-around myborder mx-2"
            style="
                background-color: var(--violet_100);
                max-height: 70px !important;
            ">
            <div
                class="ms-3"
                :class="
                    this.$route.name == 'detail' ? 'd-inline' : 'd-sm-none'
                ">
                <navigation-mobile></navigation-mobile>
            </div>
            <div class="col-8 col-sm-6 my-3">
                <div class="d-flex">
                    <input
                        class="me-2 p-2 rounded-2 border border-0 text-white"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        style="background-color: var(--bg_input); width: 80%"
                        v-model="inputSearch"
                        @keyup.enter="gotoSearch(inputSearch)" />
                    <button
                        class="btn"
                        @click="gotoSearch(inputSearch)"
                        style="
                            box-shadow: 0 0 1px 2px var(--btn);
                            color: var(--text);
                        ">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            </div>

            <account-tools
                class="d-none d-sm-flex"
                :accountId="accountStore.account._id"></account-tools>
        </div>
    </div>
</template>

<script>
import { useAccountStore } from '../store/account';
import AvatarCircle from './AvatarCircle.vue';
import NavigationMobile from './NavigationMobile.vue';
import AccountTools from './AccountTools.vue';
export default {
    setup() {
        const accountStore = useAccountStore();
        return { accountStore };
    },
    data() {
        return {
            inputSearch: null,
            isDetailPage: this.$route.name === 'detail',
        };
    },
    components: { NavigationMobile, AvatarCircle, AccountTools },
    methods: {
        gotoSearch(input) {
            if (input) {
                this.$router.push({
                    name: 'search',
                    params: {
                        textSearch: this.inputSearch,
                    },
                });
            }
            this.inputSearch = '';
        },
    },
    mounted() {},
};
</script>

<style scoped>
@media screen and (max-width: 992px) {
    button.btn.btn-secondary.dropdown-toggle::after {
        margin: 0;
    }
}
</style>
