import admin from '../admin/app.vue'
import usradmin from "../admin/usradmin.vue"
import equadmin from "../admin/equadmin.vue"

const routes=[
    {
        path:'/module1',
        component:admin,
        name:'module1',
        icon: 'el-icon-menu'
    },
    {
        path:'/module2',
        component:admin,
        name:'module2',
        icon: 'el-icon-share'
    },

    {
        path: '/admin',
        component: admin,
        name: '设置',
        children:[
            {
                path:'/usradmin',
                component: usradmin,
                name: '用户管理',
                icon: 'el-icon-setting'
            },
            {
                path:'/equadmin',
                component: equadmin,
                name: '设备管理',
                icon: 'el-icon-setting'
            }
        ],
        icon: 'el-icon-setting'
    }
]

export default routes;
