<template>
    <div class="all">
        <router-view></router-view>
    </div>
</template>

<script>
	import navpanel from "./nav.vue"
	
    export default {
        data() {
            return {
                systitle: 'wpweb'
            };
        },
		components:{
			navpanel
		}
    }
</script>
<style scope>
</style>
