import Vue from 'vue'
import elementui from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import app from './app.vue'

Vue.use(elementui);

new Vue({
    el:'#desktop',
    render: h => h(app)
});
