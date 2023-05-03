import { defineStore } from 'pinia';
import accountService from '../services/account.service';
import Swal from 'sweetalert2';
export const useAccountStore = defineStore('account', {
    state: () => ({ account: null }),
    getters: {},
    actions: {
        async getAccount() {
            const id = localStorage.getItem('id');
            this.account = {};
            if (!id) return;
            try {
                this.account = JSON.parse(
                    JSON.stringify(await accountService.get(id)),
                );
            } catch (err) {
                console.log(err);
            }
        },
        checkVideoExist(videoId) {
            const myVideos = JSON.parse(JSON.stringify(this.account.myVideos));
            return myVideos.some((video) => video._id === videoId);
        },
        checkAccount() {
            if (this.account && Object.keys(this.account).length) return true;
            return false;
        },
        async addVideo(videoId) {
            await accountService
                .addVideo(this.account._id, videoId)
                .then((status) => {
                    if (status.added) {
                        Swal.fire({
                            position: 'top',
                            icon: 'success',
                            title: 'Success',
                            text: "Added into your 'My Videos' 🥳",
                            showConfirmButton: false,
                            timer: 1000,
                        });
                    } else {
                        Swal.fire({
                            position: 'top',
                            icon: 'error',
                            title: 'Error',
                            text: "This Video exist in your 'My Videos'😭",
                            showConfirmButton: false,
                            timer: 1000,
                        });
                        return;
                    }
                });
        },
        async refresh() {
            await this.getAccount();
        },
    },
});
