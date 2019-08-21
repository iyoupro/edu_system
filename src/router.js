import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index'
import Register from './views/Register'
import NotFound from './views/NotFound'
import Login from './views/Login'
import TaskManageTea from './views/TaskManageTea'
import MyCourseTea from './views/MyCourseTea'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'index',
            component: Index,
            menuShow: true,
            menuName: '首页'
        },
        {
            path: '/index',
            name: 'index',
            component: Index,
            menuShow: false,
        },
        {
            path: '/TaskManageTea',
            name: 'TaskManageTea',
            component: TaskManageTea,
            menuShow: true,
            menuName: '作业管理'
        },
        {
            path: '/register',
            name: 'register',
            component: Register,
            menuShow: false,
        },
        {
            path: '/MyCourseTea',
            name: 'MyCourseTea',
            component: MyCourseTea,
            menuShow: true,
            menuName: '课程管理',
            children: [{
                path: '/MyCourseTea',
                name: 'MyCourseTea',
                component: MyCourseTea,
                menuShow: true,
                menuName: '我的课程'
            }, {
                path: '/',
                name: 'index',
                component: Index,
                menuShow: true,
                menuName: '教学进度'
            },]
        }
        ,
        {
            path: '/login',
            name: 'login',
            component: Login,
            menuShow: false,
        },
        {
            path: '*',
            name: '404',
            component: NotFound,
            menuShow: false,
        },
    ]
})

router.beforeEach((to, from, next) => {
    const isLogin = localStorage.token ? true : false;
    if (to.path == "/login" || to.path == "/register") {
        next();
    } else {
        isLogin ? next() : next('/login');
    }
})

export default router;