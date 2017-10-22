<template>
    <div>
        <el-tabs activeName="custom_entity">
            <el-tab-pane key="custom_entity" label="实体定义" name="custom_entity">
                <el-row>
                    <div @contextmenu="showMenu_entiryTree">
                        <VueContextMenu :contextMenuData="entityTreeContextMenu" @refresh="refreshEntity" @add="addEntity" @del="delEntity">
                        </VueContextMenu>
                        <el-col :span="6">
                            <el-tree ref="entityTree" :data="entityData" :props="entityProps" node-key="ID" @node-click="handleEntityClick" show-checkbox default-expand-all highlight-current>
                            </el-tree>
                        </el-col>
                    </div>
                    <el-col :span="18">
						<el-button @click="onSaveEntityDetail" title="保存当前实体定义，若编号为空则新增此实体定义">保存</el-button>
                        <el-collapse value="entityDetail">
                            <el-collapse-item title="实体信息" name="entityDetail">
                                <el-form  label-width="100px" :model="entityDetailForm" :rules="entityDetailRules">
                                    <el-form-item label="表名" prop="name" title="不能重复！！！"><el-input v-model="entityDetailForm.name"></el-input></el-form-item>
                                    <el-form-item label="显示" prop="label"><el-input v-model="entityDetailForm.label"></el-input></el-form-item>
                                    <el-form-item label="备注" prop="title"><el-input v-model="entityDetailForm.title"></el-input></el-form-item>
                                </el-form>
                            </el-collapse-item>
                            <el-collapse-item title="字段定义" name="entityFields">
								<el-table :data="fieldsData">
									<el-table-column prop="name" label="字段名"></el-table-column>
									<el-table-column prop="label" label="显示名称"></el-table-column>
									<el-table-column prop="type" label="类型"></el-table-column>
									<el-table-column prop="title" label="备注"></el-table-column>
								</el-table>
                            </el-collapse-item>
                        </el-collapse>
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
                name: '',
                label: '',
				title:'',
            },
            entityDetailRules:{
                name: [
                    { required: true, message: '请输入表名', trigger: 'blur' }
                ],
                label: [
                    { required: true, message: '请输入显示名称', trigger: 'blur' }
                ],
            },
			// 当前选中实体的字段定义信息
			fieldsData:[],
        };
    },
    methods:{
//////// entity function ///////////////////////        
        refreshEntity:function () {
            axios.get(this.baseUrl)
                .then(function (response) {
                    console.log('[adminCustom.refreshEntity()]', response);
                    this.entityData = response.data;
                }.bind(this))
                .catch(function (error) {
                    alert(error);
                    console.log('[adminCustom.refreshEntity()]', error);
                });
        },
        // 选中某个实体定义后显示详情
        handleEntityClick:function (data) {
            console.log('[adminCustom.handleEntityClick()]',data);
            this.entityDetailForm.name = data['name'];
            this.entityDetailForm.label = data['label'];
            this.entityDetailForm.title = data['title'];
			this.fieldsData = data['fields'];
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
			if((this.entityDetailForm.name == '')|| (this.entityDetailForm.label == '') || (this.fieldsData.length == 0)){
				alert("参数不完备！");
				return;
			}
            var item = {
				name:this.entityDetailForm.name,
				label:this.entityDetailForm.label,
				title:this.entityDetailForm.title,
				fields:this.fieldsData,
			};
			console.log('[adminCustom.onSaveEntityDetail()]', item);
			
			axios.put(this.baseUrl, [item])
				.then(function (response) {
					console.log('[adminCustom.onSaveEntityDetail()]', response);
					this.refreshEntity();
				}.bind(this))
				.catch(function (error) {
					alert(error);
					console.log('[adminCustom.onSaveEntityDetail()]', error);
				}.bind(this));
        },
        showMenu_entiryTree:function (parameter) {
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
