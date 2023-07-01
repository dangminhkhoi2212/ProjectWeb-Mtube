import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import router from './router';
import './assets/css/style.css';
import { createPinia } from 'pinia';
import piniaPersist from 'pinia-plugin-persist'; //https://seb-l.github.io/pinia-plugin-persist/
import { plugin, defaultConfig } from '@formkit/vue';
import '@formkit/themes/genesis';
import { LoadingPlugin } from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPersist);

app.use(pinia);
app.use(router);
app.use(LoadingPlugin);
app.use(plugin, defaultConfig);
app.mount('#app');
