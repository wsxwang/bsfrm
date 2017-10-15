import axios from "axios"

// 缓存的所有的任务信息
var tasks=[];

// 从后端获取任务数据
var fetchTasksBackend=function () {
    axios.get('/tasks/listTasks')
        .then(function (response) {
            this.tasks = [];
            for(var i in response.data)
            {
                var t = new Object();
                t['guid'] = response.data[i]['guid'];
                t['name'] = response.data[i]['name'];
                t['remark'] = response.data[i]['remark'];
                this.tasks.push(t);
            }
        }.bind(this))
        .catch(function (error) {
            console.log(error);
        });
}

// 获取任务各字段的显示名称
var fetchTaskFields=function () {
    return [
        {label:'名称', prop:'name'},
        {label:'类型', prop:'type'},
        {label:'开始日期', prop:'start'},
        {label:'结束日期', prop:'stop'},
        {label:'备注', prop:'remark'},
        {label:'承担人员', prop:'engineers'},
        {label:'进度', prop:'progress'},
        {label:'编号', prop:'guid', hidden:true},
        {label:'资料地址', prop:'svnUrl', hidden:true},
    ];
};

// 任务列表中显示的字段
var fetchTaskCols2Show=fetchTaskFields;

// 在内存缓存中根据id查找任务
var fetchProjectInMem=function (id) {
    return this.tasks.find((t) => t['guid'] == id);
};

export default {
    // data:
    tasks,
    // function:
    fetchTasksBackend,
    fetchTaskFields,
    fetchTaskCols2Show,
    fetchProjectInMem,
};