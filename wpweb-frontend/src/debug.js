import Vue from 'vue'
import elementui from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import axios from "axios"
import debug from './views/debug.vue'

// axios配置
axios.defaults.baseURL='http://localhost:3000/';

Vue.use(elementui);

new Vue({
    el:'#debug',
    render: h => h(debug)
});