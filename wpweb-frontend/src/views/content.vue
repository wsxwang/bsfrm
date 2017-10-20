<template>
    <div>
        <nav_panel></nav_panel>
        <router-view>
            <router-view></router-view>
        </router-view>

    </div>
</template>

<script>
import nav_panel from "./nav_panel.vue"

export default {
    data() {
        return {
            title: 'content container page'
        };
    },
    components:{
        nav_panel
    }
}
</script>
