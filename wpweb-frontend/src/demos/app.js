import Vue from 'vue'
import VueRouter from 'vue-router'
import elementui from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import app from './app.vue'
import routes from './routes'

Vue.use(elementui);
Vue.use(VueRouter);

const router = new VueRouter({
    routes
})
new Vue({
    el:'#demos',
    router,
    render: h => h(app)
});
