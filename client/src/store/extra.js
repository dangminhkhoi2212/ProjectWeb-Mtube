import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

export const useExtraStore = defineStore('extra', {
    state: () => {
        return {
            isDetailPage: Boolean,
        };
    },
    getters: {},
    actions: {
        setDetailPage(bool) {
            this.isDetailPage = bool;
        },
        myAlert(icon, title) {
            Swal.fire({
                position: 'top',
                icon: icon,
                title: title,
                showConfirmButton: false,
                timer: 1500,
            });
        },
        myConfirm(title, icon, text, confirmButtonText) {
            return Swal.fire({
                title: title,
                text: text,
                icon: icon,
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: confirmButtonText,
            }).then((result) => {
                return result.isConfirmed;
            });
        },
    },
});
