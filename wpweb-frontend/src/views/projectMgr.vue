<template>
	<div>
        <el-button @click="refresh">刷新</el-button>
        <el-button @click="newProject">添加项目</el-button>
        <el-button @click="hideDetail">隐藏详情</el-button>
		<div class="projectList">
			<el-table :data="gridData" highlight-current-row @current-change="handleCurrentChange">
				<el-table-column v-for="c in gridCols" :key="c.prop" :prop="c.prop" :label="c.label" v-if="!c.hidden"></el-table-column>
			</el-table>
		</div>
        <div v-show="showDetail">
            <el-tabs value="baseInfo">
                <el-tab-pane label="基本信息" name="baseInfo">
                    <projectBaseInfo :project="currentProject"></projectBaseInfo>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import projectBaseInfo from "./projectBaseInfo.vue"
    import api from "../api/apiProjectMgr"

export default {
    name:'projectMgr',
    data() {
        return {
			// 列头
			gridCols:[],
			// 与grid绑定的数据
			gridData:[],
            // 当前选中的行的项目
            currentProject:new Object(),
			// 是否显示详情
            showDetail:false,
        };
    },
	components:
	{
        projectBaseInfo
	},
	methods: {
        newProject: function () {
            alert("未实现");
        },

        // 刷新数据
        refresh: function () {
            this.gridCols = this.fetchProjectCols2Show();
            var projects = api.fetchProjectsBackend();
            this.gridData = this.Projects2Show(projects);
        },
        // 查看选中行的项目详情
        handleCurrentChange: function (val) {
            if (val) {
                this.currentProject = api.fetchProjectsBackend(val['guid']);
                console.log(this.currentProject);
                this.showDetail = true;
            }
        },
        hideDetail:function () {
            this.showDetail = false;
        },
        // 返回显示在项目列表中的列头
        fetchProjectCols2Show:function () {
            return [
                {label:'名称', prop:'name'},
                {label:'机械设计日期', prop:'mdDate'},
                {label:'电气设计日期', prop:'edDate'},
                {label:'参考项目', prop:'referProjects'},
                {label:'项目经理', prop:'manager'},
                {label:'分解任务', prop:'tasks'},
                {label:'备注', prop:'remark'},
                {label:'承担工程师', prop:'engineers'},
                {label:'承担工人', prop:'workers'},
                {label:'编号', prop:'guid', hidden:true},
                {label:'资料地址', prop:'svnUrl', hidden:true},
            ];
        },
        // 将projects（项目清单）转换为需要显示的格式
        Projects2Show:function (projects) {
            var ret = [];
            var r;
            for (var i in projects) {
                var r = new Object();
                r.guid = projects[i]['guid'];
                r.name = projects[i]['name'];
                r.mdDate = projects[i]['mdStart'] + '~' + projects[i]['mdStop'];
                r.edDate = projects[i]['edStart'] + '~' + projects[i]['edStop'];
                r.remark = projects[i]['remark'];
                r.svnUrl = projects[i]['svnUrl'];
                r.manager = projects[i]['manager'];
                r.referProjects = projects[i]['referProjects'].length;
                r.tasks = projects[i]['tasks'].length;
                r.engineers = projects[i]['engineers'].length;
                r.workers = projects[i]['workers'].length;
                ret.push(r);
            }
            return ret;
        },
    },
	mounted:function () {
        this.refresh();
        this.showDetail = false;
    }
}
</script>
