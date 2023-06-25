<template>
    <div style="height: calc(100vh - 80px)">
        <PrettyChatWindow
            :projectId="projectId"
            :username="username"
            :secret="secret" />
    </div>
</template>

<style>
.ce-new-chat-button {
    width: 32px;
    position: relative;
    bottom: 22px;
}
.ce-chat-card,
.ce-my-message-body {
    background-color: var(--btn) !important;
    box-shadow: none !important;
    border: none !important;
}
.ce-avatar {
    box-shadow: 0 0 1px 0.8px var(--text) !important;
}
.ce-my-message-body,
.ce-their-message-body {
    /* box-shadow: 0 0 0.1px 0.5px var(--text) !important; */
    padding: 0.1rem !important;
}
</style>

<script>
import { PrettyChatWindow } from 'react-chat-engine-pretty';

import { applyReactInVue } from 'veaury';
import { useAccountStore } from '../store/account';
export default {
    setup() {
        const accountStore = useAccountStore();
        return { accountStore };
    },
    data() {
        return {
            projectId: import.meta.env.VITE_CHAT_ENGINE_PROJECT_ID,
            username: '@' + this.accountStore.account.username,
            secret: this.accountStore.account._id,
        };
    },
    components: {
        PrettyChatWindow: applyReactInVue(PrettyChatWindow),
    },
};
</script>
