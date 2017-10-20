<template>
    <div id="navpanel" class="navpanel">
		<el-menu mode="horizontal" class="navbar" default-active="$router.options.routes[0].path" router unique-opened>
			<template v-for="r in $router.options.routes" v-if="!r.hidden">
				<template v-if="r.children">
				<el-submenu :index="r.name">
					<template slot="title"><i :class="r.icon"></i>{{r.name}}</template>
					<el-menu-item v-for="c in r.children" :key="c.path" :index="c.path" :route="c.route">
						<i :class="c.icon"></i>
						{{c.name}}
					</el-menu-item>
				</el-submenu>
				</template>
				<template v-else>
					<el-menu-item :index="r.path" :route="r.route">
						<i :class="r.icon"></i>
						{{r.name}}
					</el-menu-item>
				</template>
			</template>

			<el-submenu index="user">
				<template slot="title"><i :class=""></i>{{userName}}</template>
				<el-menu-item index="/login/" @click="logout">注销</el-menu-item>
			</el-submenu>
		</el-menu>
 </div>
</template>

<script>
    export default {
		data:function(){
			return{
				userName:this.$store.getters.userName
			}
		},
		methods:{
			logout(){
				sessionStorage.removeItem('userID');
				this.$store.commit('removeUser');
			}
		}
    }
</script>
<style scope>
</style>
