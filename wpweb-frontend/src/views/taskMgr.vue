<template>
	<div>
		<div class="taskList">
			<el-table :data="gridData" highlight-current-row @current-change="handleCurrentChange">
				<el-table-column v-for="c in gridCols" :key="c.prop" :prop="c.prop" :label="c.label" v-if="!c.hidden"></el-table-column>
			</el-table>
		</div>
        <div>
            <taskDetail :projectID="currentTaskGuid"></taskDetail>
        </div>
    </div>
</template>

<script>
    import taskDetail from "./taskDetail.vue"

export default {
    name:'taskMgr',
    data() {
        return {
			// 列头
			gridCols:[],
			// 与grid绑定的数据
			gridData:[],
            // 当前选中的行的任务id
            currentTaskGuid:'',
			
        };
    },
	components:
	{
        taskDetail
	},
	methods:{
        // 刷新数据
		refresh:function(){
		},
		// 查看选中行的项目详情
		handleCurrentChange:function(val) {
		    if (val) {
                this.currentTaskGuid = val['guid'];
            }
		},
	},
	mounted:function () {
        this.refresh();
    }
}
</script>
