<template>
    <div>
		<h1>{{title}}</h1>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: 'demos home page'
        };
    },
}
</script>
