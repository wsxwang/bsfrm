import content from "./views/content.vue"
import adminusr from "./views/adminusr.vue"
import adminequ from "./views/adminequ.vue"
import adminCustom from "./views/adminCustom.vue"
import debug from "./views/debug.vue"
import login from "./views/login.vue"

const routes=[
    {
        path: '/login',
        component:login,
        name: 'login',
		hidden:true,
    },
	{
        path: '/',
        component:login,
        hidden:true,
	},
	{
		path: '/content',
		component:content,
		name: '项目工作区',
		icon: 'el-icon-menu',
        auth:true,
		children:[
		]
	},
	{
		path: '/content',
		component:content,
		name: '设置',
		icon: 'el-icon-setting',
        auth:true,
		children:[
            {
                path:'/content/adminCustom',
                component:adminCustom,
                name:'定制管理',
                icon: 'el-icon-setting',
                auth:true,
            },
			{
				path:'/content/adminusr',
				component:adminusr,
				name:'用户管理',
				icon: 'el-icon-setting',
                auth:true,
			},
			{
				path:'/content/adminequ',
				component:adminequ,
				name:'设备管理',
				icon: 'el-icon-setting',
                auth:true,
			}
		]
	},
    {
        path: '/debug',
        component:debug,
        name: 'debug',
        icon: 'el-icon-more',
		hidden:false,
    },

]

export default routes;
