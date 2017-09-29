<template>
    <div id = "desktop">
        <p>{{systitle}}</p>
        <el-row>
        <el-col :span="6">
            <el-menu  default-active="$router.options.routes[0].path" router unique-opened>
                <template v-for="r in $router.options.routes">
                    <el-submenu :index="r.path" v-if="r.children" :route="r.route">
                        <template slot="title"><i :class="r.icon"></i>{{r.name}}</template>
                        <el-menu-item v-for="c in r.children" :key="c.path" v-if="r.children" :index="c.path" :route="c.route">
                            <i :class="c.icon"></i>
                            {{c.name}}
                        </el-menu-item>
                    </el-submenu>
                    <template v-else>
                        <el-menu-item :index="r.path" :route="r.route">
                            <i :class="r.icon"></i>
                            {{r.name}}
                        </el-menu-item>
                    </template>
                </template>
            </el-menu>
        </el-col>
        </el-row>
        <!--
        <h1 v-for="r in $router.options.routes" :key="r.path" index="r.path">
            {{r.name}}
            <template v-if="r.children">
                <h2 v-for="c in r.children">{{c.name}}</h2>
            </template>
        </h1>
    -->
        <br><br><br>
<!--
        <el-menu default-active="" class="el-menu">
            <el-submenu v-for="r in $router.options.routes" :key="r.path" index="r.path">
            {{r.name}}
            <template v-if="r.children">
                <h2 v-for="c in r.children">{{c.name}}</h2>
            </template>
            </el-submenu>
        </el-menu>


            <br><br><br>
		<el-row>
			<el-col :span="6" v-for="card in $router.options.routes" :key="card.name">
				<a :href="card.path" class="link">
					<el-card :body-style="{ padding: '0px' }" class = "card">
						<img :src = "card.pic" class="image"></img>
						<p class="card-desc">{{card.name}}</p>
					</el-card>
				</a>
			</el-col>
		</el-row>
            -->
    </div>
</template>

<script>
    export default {
        data() {
            return {
                systitle: 'mbm',
				cards:[
					{
						desc:'项目管理',
						//pic:ProjectManager,
						route:'/ProjectManager'
					},
					{
						desc:'任务管理',
						//pic:TaskManager,
						route:'/TaskManager'
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
