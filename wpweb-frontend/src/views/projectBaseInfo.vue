<template>
    <div>
        <el-form :model="formData" :rules="formRules" label-width="100px" class="projectBaseInfoForm">
            <el-form-item label="项目名称" prop="name">
                <el-input type="text" v-model="formData.name":readonly="readOnly"></el-input>
            </el-form-item>
            <el-form-item label="项目编号">
                <el-input type="text" :value="project.guid" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="机械设计日期">
                <el-input type="text" :value="project.mdStart+'~'+project.mdStop" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="电气设计日期">
                <el-input type="text" :value="project.edStart+'~'+project.edStop" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="参考项目">
				
                <el-input type="text" value="未实现" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="资料地址">
                <el-input type="text" :value="project.svnUrl" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="项目备注" prop="remark">
                <el-input type="textarea" v-model="formData.remark":readonly="readOnly" :rows="5"></el-input>
            </el-form-item>
            <el-form-item>
                <el-checkbox v-model="readOnly">不许修改</el-checkbox>
                <el-button @click="onSave" :disabled="readOnly">保存修改</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name:'projectBaseInfo',
    data() {
        return {
            formData:{
                name:'',
                remark:'',
            },
            formRules:{
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                remark:[
                    {required: false}
                ]
            },
            readOnly:true,
        };
    },
    props:{
        project:new Object(),
    },
    methods:{
        onCancel:function(){
            console.log(this.readOnly == true);
        },
        onSave:function(){

        }
    },
    watch:{
        project:function (newID) {
            this.formData.name = this.project.name;
            this.formData.remark = this.project.remark;
        }
    }
}
</script>
