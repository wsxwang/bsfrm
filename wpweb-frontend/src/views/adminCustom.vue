<template>
    <div>
        <el-tabs activeName="custom_entity">
            <el-tab-pane key="custom_entity" label="实体定义" name="custom_entity">
                <el-row>
                    <div @contextmenu="showMenu">
                        <VueContextMenu :contextMenuData="entityTreeContextMenu" @refresh="refreshEntity" @add="addEntity" @del="delEntity">
                        </VueContextMenu>
                        <el-col :span="6">
                            <el-tree ref="entityTree" :data="entityData" :props="entityProps" node-key="ID" @node-click="handleEntityClick" show-checkbox default-expand-all highlight-current>
                            </el-tree>
                        </el-col>
                    </div>
                    <el-col :span="18">
                        <el-tabs activeName="entityDetail">
                            <el-tab-pane label="实体信息" name="entityDetail">
                                <el-form  label-width="100px" clas ="entityDetail" :model="entityDetailForm" :rules="entityDetailRules">
                                    <el-form-item label="编号" label-width="100px" title="aaa"><el-input :value="entityDetailForm.ID" :disabled="true"></el-input></el-form-item>
                                    <el-form-item label="表名" label-width="100px" prop="name"><el-input v-model="entityDetailForm.name"></el-input></el-form-item>
                                    <el-form-item label="显示" label-width="100px" prop="label"><el-input v-model="entityDetailForm.label"></el-input></el-form-item>
                                    <el-form-item><el-button @click="onSaveEntityDetail">保存</el-button></el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="字段定义" name="entityFields">
                                fields
                            </el-tab-pane>
                        </el-tabs>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane key="custom_relation" label="关联定义" name="custom_relation">
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import axios from 'axios'

export default {
    data() {
        return {
            baseUrl:'/api/custom_entity',

            // entityTree控件相关信息
            entityData:[],      // 绑定在界面上entityTree控件的数据，节点是从服务端获取的数据
            entityProps:{label:'label'},   // 节点显示为entityData中数据的label属性
            entityTreeContextMenu:{// entityTree控件的右键菜单
                menuName:'entityTreeMenu',
                axios:{
                    x:null,
                    y:null,
                },
                menulists:[
                    {fnHandler:'refresh',icoName:'el-icon-setting',btnName:'刷新'},
                    {fnHandler:'add',icoName:'el-icon-more',btnName:'添加'},
                    {fnHandler:'del',icoName:'el-icon-delete',btnName:'删除选中'},
                ],
            },
            // 当前选中的实体定义信息
            entityDetailForm: {
                ID: '',
                name: '',
                label: '',
            },
            entityDetailRules:{
                name: [
                    { required: true, message: '请输入表名', trigger: 'blur' }
                ],
                label: [
                    { required: true, message: '请输入显示名称', trigger: 'blur' }
                ],
            },
        };
    },
    methods:{
//////// entity function ///////////////////////        
        refreshEntity:function () {
            axios.get(this.baseUrl)
                .then(function (response) {
                    console.log(response);
                    this.entityData = response.data;
                }.bind(this))
                .catch(function (error) {
                    alert(error);
                    console.log(error);
                });
        },
        // 选中某个实体定义后显示详情
        handleEntityClick:function (data) {
            this.entityDetailForm.ID = data['ID'];
            this.entityDetailForm.name = data['name'];
            this.entityDetailForm.label = data['label'];
            console.log(data);
        },
        addEntity:function () {
            this.entityDetailForm.ID = '';
            this.entityDetailForm.name = '';
            this.entityDetailForm.label = '';
        },
        delEntity:function () {
            var keys = this.$refs.entityTree.getCheckedKeys();
            alert("删除需谨慎，尚未实现，需要：1、删除数据；2、删除字段定义；3、删除实体定义")
        },
        onSaveEntityDetail:function () {
            var item = {ID:this.entityDetailForm.ID, name:this.entityDetailForm.name, label:this.entityDetailForm.label};
            if(this.entityDetailForm.ID == ''){
                //add
                axios.post(this.baseUrl, [item])
                    .then(function (response) {
                        console.log(response);
                        this.refreshEntity();
                    }.bind(this))
                    .catch(function (error) {
                        alert(error);
                        console.log(error);
                    }.bind(this));
            }else {
                axios.put(this.baseUrl, [item])
                    .then(function (response) {
                        console.log(response);
                        this.refreshEntity();
                    }.bind(this))
                    .catch(function (error) {
                        alert(error);
                        console.log(error);
                    }.bind(this));
            }
        },
        showMenu:function (parameter) {
			parameter.preventDefault()
			var x = parameter.clientX
			var y = parameter.clientY
			this.entityTreeContextMenu.axios = {
			  x, y
			}
        },
    },
    mounted(){
        this.refreshEntity();
    }
}
</script>

<style>
</style>
