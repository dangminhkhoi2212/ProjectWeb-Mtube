<template>
    <div id="connection">
        <div style="height: calc(100vh - var(--height_header))" class="mx-sm-5">
            <div class="col-12 col-xl-5 mx-auto">
                <div class="d-flex">
                    <div
                        role="button"
                        class="btn fs-5 col-6 text-center"
                        :class="{ active_btn: activeField === 'followers' }"
                        @click="changeActiveField('followers')">
                        {{
                            this.accountStore.account.followers.length.toLocaleString(
                                'en-US',
                            )
                        }}
                        Followers
                    </div>
                    <div
                        role="button"
                        class="btn fs-5 col-6 text-center"
                        :class="{ active_btn: activeField === 'following' }"
                        @click="changeActiveField('following')">
                        {{
                            this.accountStore.account.following.length.toLocaleString(
                                'en-US',
                            )
                        }}
                        Following
                    </div>
                </div>
                <hr class="m-0" />
                <Transition name="slide-fade">
                    <div class="d-flex justify-content-center p-3">
                        <Follow
                            :activeField="activeField"
                            :key="activeField"></Follow>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script>
import { useAccountStore } from '../store/account';
import accountService from '../services/account.service';
import Follow from '../components/Follow.vue';
export default {
    setup() {
        const accountStore = useAccountStore();

        return { accountStore };
    },
    components: {
        Follow,
    },
    data() {
        return {
            followers: [],
            activeField: 'followers',
        };
    },
    methods: {
        changeActiveField(field) {
            this.activeField = field;
        },
    },
    async mounted() {},
};
</script>

<style>
#connection {
    background-image: url(../assets/images/bg_connection.jpg);
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
