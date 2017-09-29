
import demos from "./demos.vue"
import sqlitegrid from "./sqlitegrid.vue"
import demosabout from "./demosabout.vue"

const routes=[			
	    {
        path: '/demos',
		component:demos,
        name: 'demos',
        icon: 'el-icon-more',
        children:[
			{
				path:'demosabout',
				component:demosabout,
				name:'about',
				icon: 'el-icon-share'
			},
			{
				path:'sqlitegrid',
				component:sqlitegrid,
				name:'sqlite数据表格',
				icon: 'el-icon-share'
			}
        ]
    }

]

export default routes;
