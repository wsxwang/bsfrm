<template>
    <div>
		<div style="margin-bottom: 20px;">
			<el-button plain icon="el-icon-upload" size="mini" @click="onSaveInfo">保存</el-button>
			<el-button plain icon="el-icon-refresh" size="mini" @click="loadRelation">获取关联关系</el-button>
		</div>
        <el-tabs id="entity_data" class="entity_data" activeName="entity_info" type="card" tab-position="top">
            <el-tab-pane label="信息" name="entity_info">
				<el-table :data="data" style="width:100%" border stripe :show-header="false" title="双击修改" @row-dblclick="handleRowDblClick">
					<el-table-column prop="label" label="label" :width="100"></el-table-column>
					<el-table-column prop="value" label="value"></el-table-column>
				</el-table>
            </el-tab-pane>
            <el-tab-pane label="关联" name="entity_relation">
				<el-table :data="rel_data" style="width:100%" :border="false" stripe :show-header="false" title="关联关系">
					<el-table-column prop="id1" label="guid"></el-table-column>
					<el-table-column prop="label" label="label"></el-table-column>
					<el-table-column prop="id2" label="guid"></el-table-column>
				</el-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
//展示一个定制实体的一条数据信息（定制数据表中的一行数据及其关联信息）
    import axios from 'axios'
	import apiBase from '../api/apiBase.js'

export default {
    data() {
        return {
            baseUrl:'/api/custom_entity_data',
            relUrl:'/api/custom_relation',
			
			next:{item:null, metaData:null},
			previous:{item:null, metaData:null},
			
			data:[],
			rel_data:[],
        };
    },
	props:{
		// 元数据
		metadata:null,
		// 一个实体记录，null表示需要新建
		record:null,
	},
	watch:{
		record:{
			handler(val,oldVal){
				console.log('[customEntityInfo.watch.record] %o->%o', oldVal, val);
				this.mountRecordData();
				this.rel_data = [];
			},
			deep:true,
		},
		metadata:{
			handler(val,oldVal){
				console.log('[customEntityInfo.watch.metadata] %o->%o', oldVal, val);
				this.mountMetaData();
			},
			deep:true,
		},
	},
    methods:{
		// 元数据绑定控件
		mountMetaData(){
			console.log('[customEntityInfo.mountMetaData(%o,%o)]', this.metadata, this.record);
		},
		// 绑定数据
		mountRecordData(){
			console.log('[customEntityInfo.mountRecordData(%o,%o)]', this.metadata, this.record);
			this.data = [];
			if(this.metadata!=null){
				var val =(this.record != null)? this.record['guid']: '';
				if(val == ''){
					val = apiBase.newGuid();
				}
				this.data.push({
					name:'guid',
					label:'ID',
					value:val,
				});
				for(var i in this.metadata.fields){
					var meta_name = this.metadata.fields[i]['name'];
					var meta_label = this.metadata.fields[i]['label'];
					var meta_type = this.metadata.fields[i]['type'];
					var v =(this.record != null)? this.record[meta_name]: null;
					this.data.push({
						name:meta_name,
						label:meta_label,
						type:meta_type,
						value:((this.record != null)? this.record[meta_name]: null),
					});
				}
			}
		},
		// 更新或新增数据，将触发事件
        onSaveInfo:function () {
			console.log('[customEntityInfo.onSaveInfo(%o,%o)]', this.metadata, this.record);
			var savedInfo = {};
			for(var i in this.data){
				savedInfo[this.data[i]['name']] = this.data[i]['value'];
			}
			// 保存数据
			axios.put(this.baseUrl + '/' + this.metadata['name'], [savedInfo])
				.then(function (response) {
					console.log('[customEntityInfo.onSaveInfo(%o,%o)]PUT %o %o ok', this.metadata, this.record, this.baseUrl + '/' + this.metadata['name'], savedInfo);
					// 触发infoSaved事件，传入修改后的记录信息
					this.$emit('infoSaved', savedInfo);
				}.bind(this))
				.catch(function(error){apiBase.handleAxiosError(error, this);}.bind(this));
        },
		// 双击修改基本信息
		handleRowDblClick(row, e){
			console.log('[customEntityInfo.handleRowDblClick(%o,%o)]%o', this.metadata, this.record, row);
			if(row['name'] == 'guid')return;
			
			this.$prompt('请输入', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputValidator:function(inputStr){
					return inputStr != null;
				}.bind(this),
				inputPlaceholder:row['value'],
			}).then(({ value }) => {
				row['value'] = value;
			}).catch(() => {});
			
		},
		// 刷新关联关系
		loadRelation(){
			if(this.record == null) return;
			
			axios.get(this.relUrl+'/'+this.record['guid'])
				.then(function (response) {
					console.log('[customEntityInfo.loadRelation(%o,%o)]GET %o %o ok', this.metadata, this.record, this.relUrl+'/'+this.record['guid'], response);
					this.rel_data = response.data;
				}.bind(this))
				.catch(function(error){apiBase.handleAxiosError(error, this);}.bind(this));
		},

    },
    mounted(){
		console.log('[customEntityInfo.mounted(%o,%o)]', this.metadata, this.record);
		this.mountMetaData();
		this.mountRecordData();
    },
}
</script>

<style>
</style>
