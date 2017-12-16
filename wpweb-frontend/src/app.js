import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import elementui from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios"
import VueContextMenu from 'vue-contextmenu'
import 'vue-contextmenu/style/css/font-awesome.min.css'
import store from './store/index'
import app from './views/app.vue'
import routes from './routes'


// axios配置
axios.defaults.baseURL=(process.env.NODE_ENV=='production')?window.location.origin:'http://localhost:3000';

Vue.use(Vuex);
Vue.use(elementui);
Vue.use(VueContextMenu);
Vue.use(VueRouter);

const router = new VueRouter({
    routes
})

// 递归查找路由表routesArray中path为'routePath'的路由条目
var routePathInRoutes=function (routesArray, routePath) {
    for(var i in routesArray){
        if(routesArray[i].path == routePath){
            return routesArray[i];
        }
        if(routesArray[i].children != null){
            return routePathInRoutes(routesArray[i].children, routePath);
        }
    }
    return null;
}

router.beforeEach(function (to, from, next) {
    if(to.path == '/login') {
        sessionStorage.removeItem('userID');
    }
    else{
        var userID = sessionStorage.getItem('userID');
        if((userID == null) || (userID == '')){
            // 尚未登录，检查跳转路由是否需要认证
            var route = routePathInRoutes(routes, to.path);
            if (route !=null){
                if(route.auth){
                    next({path:'/login'});
                }
            }
        }
    }
    next();
})

new Vue({
    el:'#home',
    router,
    store,
    render: h => h(app)
});
