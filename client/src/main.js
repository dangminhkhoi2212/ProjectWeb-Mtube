import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import router from './router';
import './assets/css/style.css';
import { createPinia } from 'pinia';
import { plugin, defaultConfig } from '@formkit/vue';
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

const pinia = createPinia();
createApp(App)
    .use(LoadingPlugin)
    .use(pinia)
    .use(router)
    .use(plugin, defaultConfig)
    .mount('#app');
