<template>
    <div id = "desktop">
        <p>{{systitle}}</p>
		<el-row>
			<el-col :span="6" v-for="card in cards" :key="card.route">
				<a :href="card.route" class="link">
					<el-card :body-style="{ padding: '0px' }" class = "card">
						<img :src = "card.pic" class="image"></img>
						<p class="card-desc">{{card.desc}}</p>
					</el-card>
				</a>
			</el-col>
		</el-row>
    </div>
</template>

<script>
	import ProjectManager from "./ProjectManager.jpg";
	import TaskManager from "./TaskManager.jpg";
	import settings from "./settings.jpg";

    export default {
        data() {
            return {
                systitle: 'mbm',
				cards:[
					{
						desc:'项目管理',
						pic:ProjectManager,
						route:'/ProjectManager'
					},
					{
						desc:'任务管理',
						pic:TaskManager,
						route:'/TaskManager'
					},
					{
						desc:'设置',
						pic:settings,
						route:'/admin'
					},
					{
						desc:'demo',
						pic:settings,
						route:'/demos'
					}
				]
            };
        }
    }
</script>
<style scope>
.image {
    width: 100%;
    display: block;
}
a{text-decoration:none;}
</style>
