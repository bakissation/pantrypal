import { createRouter, createWebHistory } from 'vue-router';
import LoginUser from './components/LoginUser.vue';
import RegisterUser from './components/RegisterUser.vue';
import App from './App.vue';

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', component: LoginUser },
    { path: '/app', component: App },
    { path: '/register', component: RegisterUser },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;