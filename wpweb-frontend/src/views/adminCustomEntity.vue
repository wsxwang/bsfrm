<template>
    <div>
		<el-row>
			<div @contextmenu="showMenu_entiryTree">
				<VueContextMenu :contextMenuData="entityTreeContextMenu" @refresh="refreshEntity" @add="addEntity" @del="delEntity" @checkAll="checkAll" @reverseCheck="reverseCheck">
				</VueContextMenu>
				<el-col :span="6">
					<el-tree ref="entityTree" :data="entityData" :props="{label:'label'}" node-key="name" @node-click="handleEntityClick" show-checkbox default-expand-all highlight-current>
					</el-tree>
				</el-col>
			</div>
			<el-col :span="18">
				<el-button icon="plus" type="text" size="small" @click="addEntity">新建</el-button>
				<el-button icon="check" type="text" size="small" @click="onSaveEntityDetail">保存</el-button>
				<el-button icon="edit" type="text" size="small" @click="fieldsData.push({name:'', label:'', type:'varchar2(255)', title:''})">增加字段</el-button>
				<el-collapse :value="['entityDetail','entityFields']">
					<el-collapse-item title="实体信息" name="entityDetail">
						<el-form  label-width="100px" :model="entityDetailForm" :rules="entityDetailRules">
							<el-form-item label="表名" prop="name">
								<el-input v-model="entityDetailForm.name" placeholder="必填。若重复则会冲掉原实体定义！！！"></el-input>
							</el-form-item>
							<el-form-item label="显示" prop="label">
								<el-input v-model="entityDetailForm.label" placeholder="必填。"></el-input>
							</el-form-item>
							<el-form-item label="备注" prop="title">
								<el-input v-model="entityDetailForm.title"></el-input>
							</el-form-item>
						</el-form>
					</el-collapse-item>
					<el-collapse-item title="字段定义" name="entityFields">
						<el-table :data="fieldsData" border style="width:100%" @cell-dblclick="handleFieldDblClick"   title="双击表格修改。字段名、显示名称  必填、不能重复！！！">
							<el-table-column prop="name" label="字段名"></el-table-column>
							<el-table-column prop="label" label="显示名称"></el-table-column>
							<el-table-column prop="type" label="类型">
								<template scope="scope">
									<el-select v-model="scope.row.type" size="small">
										<el-option v-for="item in [{value:'varchar2(255)',label:'字符串'},{value:'number',label:'数字'}]"
										:key="item.value" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</template>
							</el-table-column>
							<el-table-column prop="title" label="备注"></el-table-column>
							<el-table-column prop="opr" label="操作" fixed="right" width="80"><template scope="scope">
								<el-button @click.native.prevent="fieldsData.splice(scope.$index, 1)" type="text" size="small">移除</el-button>
							</template></el-table-column>
						</el-table>
					</el-collapse-item>
				</el-collapse>
			</el-col>
		</el-row>
    </div>
</template>

<script>
    import axios from 'axios';
	import { Loading } from 'element-ui';
	import apiBase from '../api/apiBase.js';

export default {
    data() {
        return {
            baseUrl:'/api/custom_entity',

            // entityTree控件相关信息
            entityData:[],      // 绑定在界面上entityTree控件的数据，节点是从服务端获取的数据
            entityTreeContextMenu:{// entityTree控件的右键菜单
                menuName:'entityTreeMenu',
                axios:{
                    x:null,
                    y:null,
                },
                menulists:[
                    {fnHandler:'refresh',icoName:'el-icon-search',btnName:'刷新'},
                    {fnHandler:'add',icoName:'el-icon-plus',btnName:'新建'},
                    {fnHandler:'del',icoName:'el-icon-delete',btnName:'删除选中'},
                    {fnHandler:'checkAll',icoName:'el-icon-check',btnName:'全选'},
                    {fnHandler:'reverseCheck',icoName:'el-icon-circle-check',btnName:'反选'},
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
	computed:{
		// 修改了entity
		entityChanged:function(){
			var found = null;
			for(var i in this.entityData){
				if(this.entityData[i]['name'] == this.entityDetailForm['name']){
					found = this.entityData[i];
					break;
				}
			}
			if(found == null){
				if(this.entityDetailForm['name'] != '') return true;
				if(this.entityDetailForm['label'] != '') return true;
				if(this.entityDetailForm['title'] != '') return true;
				if(this.fieldsData.length > 1) return true;
			}else{
				if(found['name'] != this.entityDetailForm['name']) return true;
				if(found['label'] != this.entityDetailForm['label']) return true;
				if(found['title'] != this.entityDetailForm['title']) return true;
				if(found['fields'].length != this.fieldsData.length) return true;
				/*
				//...
				for(var i in this.fieldsData){
					if(found['fields'][i] != this.fieldsData[i]) return true;
				}
				*/
			}
			return false;
		}
	},
    methods:{
//////// entity function ///////////////////////        
        refreshEntity:function () {
			Loading.service({fullscreen:true});
            axios.get(this.baseUrl)
                .then(function (response) {
                    console.log('[adminCustom.refreshEntity()]', response);
                    this.entityData = response.data;
					Loading.service({fullscreen:true}).close();
                }.bind(this))
				.catch(function(error){apiBase.handleAxiosError(error, this);}.bind(this));
        },
        // 选中某个实体定义后显示详情
        handleEntityClick:function (data) {
			if(this.entityChanged){
				this.$confirm('放弃修改？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					callback:function(ret){
						if(ret == 'confirm'){
							this.entityDetailForm.name = data['name'];
							this.entityDetailForm.label = data['label'];
							this.entityDetailForm.title = data['title'];
							this.fieldsData = JSON.parse(JSON.stringify(data['fields']));
						}
					}.bind(this),
				});
			}
			else{
				this.entityDetailForm.name = data['name'];
				this.entityDetailForm.label = data['label'];
				this.entityDetailForm.title = data['title'];
				this.fieldsData = JSON.parse(JSON.stringify(data['fields']));
			}
        },
		checkAll:function(){
			var keys = [];
			for(var i in this.$refs.entityTree.children){
				keys.push(this.$refs.entityTree.children[i]['name']);
			}
			this.$refs.entityTree.setCheckedKeys(keys);
		},
		reverseCheck:function(){
			var keys = [];
			var checkedKeys = this.$refs.entityTree.getCheckedKeys(keys);
			for(var i in this.$refs.entityTree.children){
				var k = this.$refs.entityTree.children[i]['name'];
				if (checkedKeys.indexOf(k) != -1){
					continue;
				}
				keys.push(k);
			}
			this.$refs.entityTree.setCheckedKeys(keys);
		},
        addEntity:function () {
			if(this.entityChanged){
				this.$confirm('放弃修改？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
					callback:function(ret){
						if(ret == 'confirm'){
							this.entityDetailForm.name = '';
							this.entityDetailForm.label = '';
							this.entityDetailForm.title = '';
							this.fieldsData = [];
						}
					}.bind(this),
				});
			}
			else{
				this.entityDetailForm.name = '';
				this.entityDetailForm.label = '';
				this.entityDetailForm.title = '';
				this.fieldsData = [];
			}
        },
        delEntity:function () {
            var keys = this.$refs.entityTree.getCheckedKeys();
            alert("删除需谨慎，尚未实现，需要：1、删除数据；2、删除字段定义；3、删除实体定义")
        },
        onSaveEntityDetail:function () {
			console.log('[adminCustom.onSaveEntityDetail()]', this.entityDetailForm, this.fieldsData);
			if((this.entityDetailForm.name == '')|| (this.entityDetailForm.label == '') || (this.fieldsData.length == 0)){
				this.$message({
					message:'参数不完备！',
					showClose:true,
					type:'error',
				});
				return;
			}
			for(var i in this.fieldsData){
				if((this.fieldsData[i]['name'] == '') || (this.fieldsData[i]['label'] == '')){
					this.$message({
						message:'字段名和显示名称必填！',
						showClose:true,
						type:'error',
					});
					return;
				}
			}
            var item = {
				name:this.entityDetailForm.name,
				label:this.entityDetailForm.label,
				title:this.entityDetailForm.title,
				fields:this.fieldsData,
			};
			
			this.$confirm('确定保存？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info',
				callback:function(ret){
					if(ret == 'confirm'){
						Loading.service({fullscreen:true});
						axios.put(this.baseUrl, [item])
							.then(function (response) {
								console.log('[adminCustom.onSaveEntityDetail()]', response);
								Loading.service({fullscreen:true}).close();
								this.refreshEntity();
								this.$message({
									message:'保存成功',
									showClose:true,
									type:'info',
								});
								
							}.bind(this))
							.catch(function(error){
								apiBase.handleAxiosError(error, this);
								Loading.service({fullscreen:true}).close();
							}.bind(this));
					}
				}.bind(this),
			});
        },
		// 弹出在实体定义树上的右键菜单
        showMenu_entiryTree:function (parameter) {
			parameter.preventDefault();
			var x = parameter.clientX;
			var y = parameter.clientY;
			this.entityTreeContextMenu.axios = {
			  x, y
			};
        },
		// 字段列表双击某格
		handleFieldDblClick:function(row, column, cell, e){
			if((column['property'] == 'type') || (column['property'] == 'opr'))
			{
				return;
			}
			this.$prompt('请输入', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputValidator:function(inputStr){
					if(column['property'] == 'title'){
						return true;
					}
					if((column['property'] == 'name') || (column['property'] == 'label'))
					{
						if((inputStr == '')||(inputStr == null)){
							return column['label'].toString() + '不能为空';
						}					
						for(var i in this.fieldsData){
							if(inputStr == this.fieldsData[i][column['property']].toString()){
								return column['label'].toString() + '不能重复';
							}
						}
					}
					return true;
				}.bind(this),
				inputPlaceholder:row[column['property']],
			}).then(({ value }) => {
				row[column['property']] = value;
			}).catch(() => {});
		},
    },
    mounted(){
        this.refreshEntity();
    }
}
</script>

<style>
</style>
