<template>
    <div>
        <el-tabs activeName="custom_entity">
            <el-tab-pane key="custom_entity" label="实体定义" name="custom_entity">
				<adminCustomEntity></adminCustomEntity>
            </el-tab-pane>
            <el-tab-pane key="custom_relation" label="关联定义" name="custom_relation">
				<adminCustomRelation></adminCustomRelation>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
	import adminCustomEntity from './adminCustomEntity.vue'
	import adminCustomRelation from './adminCustomRelation.vue'

export default {
    data() {
        return {
        };
    },
    methods:{
    },
    mounted(){
    },
	components:{
		adminCustomEntity,
		adminCustomRelation,
	},
}
</script>

<style>
</style>
