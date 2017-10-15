// 从后端刷新项目信息
var fetchProjectsBackend=function(guid) {
    if(guid == null) {
        return [
            {
                guid: 'guid001',
                name: 'demo project 001',
                // 机械设计(machine design)开始和完成时间
                mdStart: '2015-03-24',
                mdStop: '2015-05-30',
                // 电气设计(electrical design)开始和完成时间
                edStart: '2017-09-24',
                edStop: '',
                remark: '',

                // 以下是关联字段
                // 参考项目编号
                referProjects: ['guid002', 'guid003'],
                svnUrl: '',
                // 分解的任务编号
                tasks: ['guid-t001', 'guid-t002', 'guid-t003'],
                // 工程师
                engineers: [
                    {id: 'guid-usr011', name: 'e001', other: 'xxx'},
                    {id: 'guid-usr012', name: 'e002', other: 'xxx'},
                ],
                // 工人
                workers: [
                    {id: 'guid-usr101', name: 'w001', other: 'xxx'},
                    {id: 'guid-usr102', name: 'w002', other: 'xxx'},
                ],
                // 项目经理
                manager: {id: 'guid-usr001', name: 'm001', other: 'xxx'},
            },
            {
                guid: 'guid002',
                name: 'demo project 002',
                mdStart: '2016-08-24',
                mdStop: '2017-03-30',
                edStart: '2017-09-24',
                edStop: '2017-10-01',
                remark: '已完成',
                referProjects: ['guid002', 'guid003'],
                svnUrl: 'svn://xxxx',
                tasks: ['guid-t001', 'guid-t002', 'guid-t003'],
                engineers: [
                    {id: 'guid-usr021', name: 'e021', other: 'xxx'},
                    {id: 'guid-usr022', name: 'e022', other: 'xxx'},
                ],
                workers: [
                    {id: 'guid-usr201', name: 'w021', other: 'xxx'},
                    {id: 'guid-usr202', name: 'w022', other: 'xxx'},
                ],
                manager: {id: 'guid-usr002', name: 'm002', other: 'xxx'},
                svnUrl: '',
            }
        ];
    }
    else {
        return {
            guid: 'guid002',
            name: 'demo project 002',
            mdStart: '2016-08-24',
            mdStop: '2017-03-30',
            edStart: '2017-09-24',
            edStop: '2017-10-01',
            remark: '已完成',
            referProjects: ['guid002', 'guid003'],
            svnUrl: 'svn://xxxx',
            tasks: ['guid-t001', 'guid-t002', 'guid-t003'],
            engineers: [
                {id: 'guid-usr021', name: 'e021', other: 'xxx'},
                {id: 'guid-usr022', name: 'e022', other: 'xxx'},
            ],
            workers: [
                {id: 'guid-usr201', name: 'w021', other: 'xxx'},
                {id: 'guid-usr202', name: 'w022', other: 'xxx'},
            ],
            manager: {id: 'guid-usr002', name: 'm002', other: 'xxx'},
            svnUrl: '',
        };
    }
};


// 获取项目各字段的显示名称
var fetchProjectFields=function () {
    return [
        {label:'编号', prop:'guid', hidden:true, readonly:true},
        {label:'名称', prop:'name'},
        {label:'机械设计开始日期', prop:'mdStart', readonly:true},
        {label:'机械设计结束日期', prop:'mdStop', readonly:true},
        {label:'电气设计开始日期', prop:'edStart', readonly:true},
        {label:'电气设计结束日期', prop:'edStop', readonly:true},
        {label:'参考项目', prop:'referProjects'},
        {label:'项目经理', prop:'manager'},
        {label:'分解任务', prop:'tasks'},
        {label:'备注', prop:'remark'},
        {label:'承担工程师', prop:'engineers'},
        {label:'承担工人', prop:'workers'},
        {label:'资料地址', prop:'svnUrl', hidden:true, readonly:true},
    ];
};

export default {
    // function:
    fetchProjectsBackend,
    fetchProjectFields,
};