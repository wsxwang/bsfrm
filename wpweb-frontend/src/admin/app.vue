<template>
    <div id='admin'>
        <el-collapse>
            <el-collapse-item title="用户管理" name="1">
                <usradmin></usradmin>
            </el-collapse-item>
            <el-collapse-item title="设备管理" name="2">
                <equadmin></equadmin>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script >
    import usradmin from './usradmin.vue'
    import equadmin from './equadmin.vue'

export default {
    data() {
        return {
            title: '系统管理',
            c1:usradmin,
            c2:equadmin
        };
    },
    components:{
        usradmin,
        equadmin
    }
}
</script>