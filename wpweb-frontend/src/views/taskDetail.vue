<template>
    <div>
        <h1>{{taskID}}</h1>
    </div>
</template>

<script>
export default {
    name:'taskDetail',
    data() {
        return {
        };
    },
    props:{
        // guid为唯一标识
        taskID:'',
    },
    components:{
    },
}
</script>
