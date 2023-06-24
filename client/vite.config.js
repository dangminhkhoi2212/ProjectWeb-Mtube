import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
const url_local = 'http://localhost:3000';
// const url_local = 'https://minhkhoi.cyclic.app';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 3001,
        proxy: {
            '/account': {
                target: url_local,
                changeOrigin: true,
            },
            '/video': {
                target: url_local,
                changeOrigin: true,
            },
            '/comment': {
                target: url_local,
                changeOrigin: true,
            },
        },
    },
    compilerOptions: {
        isCustomElement: (tagName) => {
            return (
                tagName === 'vue-advanced-chat' || tagName === 'emoji-picker'
            );
        },
    },
    publicPath: process.env.NODE_ENV === 'production' ? '/Video_Client/' : '/',
});
