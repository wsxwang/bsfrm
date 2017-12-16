<template>
    <div>
		<el-button icon="el-icon-refresh" type="text" size="small" @click="refreshRelation">刷新</el-button>
		<el-button icon="el-icon-plus" type="text" size="small" @click="relationData.push({})">新建</el-button>
		<el-button icon="el-icon-upload" type="text" size="small" @click="saveRelation">保存</el-button>
		<el-table :data="relationData" border style="width:100%" @cell-dblclick="handleDblClick" title="关系两端的GUID为必填项！！！">
			<el-table-column prop="id1" label="实体1的GUID"></el-table-column>
			<el-table-column prop="ename1" label="实体2的元数据"></el-table-column>
			<el-table-column prop="id2" label="实体2的GUID"></el-table-column>
			<el-table-column prop="ename2" label="实体2的元数据"></el-table-column>
			<el-table-column prop="label" label="关系显示为"></el-table-column>
			<el-table-column prop="opr" label="操作" fixed="right" width="80">
				<template slot-scope="scope">
					<el-button @click.native.prevent="relationData.splice(scope.$index, 1)" type="text" size="small">移除</el-button>
				</template>
			</el-table-column>
		</el-table>
    </div>
</template>

<script>
    import axios from 'axios';
	import { Loading } from 'element-ui';
	import apiBase from '../api/apiBase.js';

export default {
    data() {
        return {
            baseUrl:'/api/custom_relation',

			relationData:[],
        };
    },
    methods:{
        refreshRelation:function (lockScreen=true) {
			lockScreen==true?Loading.service({fullscreen:true}):lockScreen;
            axios.get(this.baseUrl)
                .then(function (response) {
                    console.log('[adminCustom.refreshRelation()]', response);
                    this.relationData = response.data;
					lockScreen==true?Loading.service({fullscreen:true}).close():lockScreen;
                }.bind(this))
				.catch(function(error){
					apiBase.handleAxiosError(error, this);
					lockScreen==true?Loading.service({fullscreen:true}).close():lockScreen;
				}.bind(this));
        },
        saveRelation:function () {
			console.log('[adminCustom.saveRelation()]', this.relationData);
			for(var i in this.relationData){
				if((this.relationData[i]['id1'] == '') || (this.relationData[i]['id2'] == '') || (this.relationData[i]['id1'] == null) || (this.relationData[i]['id2'] == null)){
					this.$message({
						message:'关系两端实体的GUID必填！',
						showClose:true,
						type:'error',
					});
					return;
				}
			}
			this.$confirm('确定保存？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'info',
				callback:function(ret){
					if(ret == 'confirm'){
						Loading.service({fullscreen:true});
						axios.put(this.baseUrl, this.relationData)
							.then(function (response) {
								console.log('[adminCustom.saveRelation()]', response);
								Loading.service({fullscreen:true}).close();
								this.refreshRelation();
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
		// 双击某格
		handleDblClick:function(row, column, cell, e){
			this.$prompt('请输入', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputValidator:function(inputStr){
					if((column['property'] == 'id1') || (column['property'] == 'id2'))
					{
						if((inputStr == '')||(inputStr == null)){
							return column['label'].toString() + '不能为空';
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
        this.refreshRelation(false);
    }
}
</script>

<style>
</style>
