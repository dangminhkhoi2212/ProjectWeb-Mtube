import { createWebHistory, createRouter } from 'vue-router';
import pinia from '../store/defineStore';
import { useAccountStore } from '../store/account';
const accountStore = useAccountStore(pinia);

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/Home.vue'),
    },
    {
        path: '/user',
        children: [
            {
                path: 'login',
                name: 'login',
                component: () => import('@/views/Login.vue'),
            },
            {
                path: 'favorite',
                name: 'favorite',
                component: () => import('@/views/FavoriteVideo.vue'),
            },
            {
                path: 'register',
                name: 'register',
                component: () => import('@/views/Register.vue'),
            },
            {
                path: 'editprofile',
                name: 'editprofile',
                component: () => import('@/views/EditProfile.vue'),
            },
            {
                path: 'uploadVideo',
                name: 'uploadVideo',
                component: () => import('@/views/UploadVideo.vue'),
            },
            {
                path: 'connection',
                name: 'connection',
                component: () => import('@/views/Connection.vue'),
            },
        ],
    },
    {
        path: '/detail/:id',
        name: 'detail',
        component: () => import('@/views/DetailVideo.vue'),
        props: true,
    },
    {
        path: '/search/:textSearch',
        name: 'search',
        component: () => import('@/views/Search.vue'),
        props: true,
    },
    {
        path: '/profile/:accountId',
        name: 'profile',
        component: () => import('@/views/Profile.vue'),
        props: true,
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import('@/views/Chat.vue'),
    },
    {
        path: '/chat',
        name: 'chat',
        component: () => import('@/views/Chat.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: () => import('@/views/NotFound.vue'),
    },
];
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    linkExactActiveClass: 'active_nav',
    routes,
});
// if don't login, website will direct login page
router.beforeEach(async (to, _from, next) => {
    if (!accountStore.checkAccount() && localStorage.getItem('id'))
        await accountStore.getAccount();
    const accountExisted =
        localStorage.getItem('id') && accountStore.checkAccount();

    if (
        !accountExisted &&
        !(to.name === 'login') &&
        !(to.name === 'register')
    ) {
        next({ name: 'login' });
    } else if (accountExisted && to.name === 'login') next({ name: 'home' });
    else next();
});

export default router;
