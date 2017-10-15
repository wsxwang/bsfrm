<template>
    <div>
        <navpanel></navpanel>
        <router-view>
            <router-view></router-view>
        </router-view>

    </div>
</template>

<script>
import navpanel from "./nav.vue"

export default {
    data() {
        return {
            title: 'content container page'
        };
    },
    components:{
        navpanel
    }
}
</script>
