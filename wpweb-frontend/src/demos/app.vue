<template>
    <div id = "demos">
        <p>{{title}}</p>
		<!--
		 <header>
		<router-link to="/demos">demos</router-link>
		<br>
		<router-link to="/demos/sqlitegrid">sqlitegrid</router-link>
		<br>
		<router-link to="/demos/demosabout">demosabout</router-link>
		<br>
		 </header>
		<router-view></router-view> -->

		
        <el-row class="container">
			<el-col :span="6">
				<el-menu  default-active="$router.options.routes[0].path" :router="true">
					<template v-for="r in $router.options.routes">
						<el-submenu :index="r.path" v-if="r.children">
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
			<el-col :span="18">
				<router-view></router-view> 
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                title: 'demos'
            };
        }
    }
</script>

<style scope>
</style>
