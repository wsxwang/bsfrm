<template>
    <div>
		<el-button icon="el-icon-plus" type="text" size="small" @click="addRecord" title="新增一行记录">添加</el-button>
		<el-button icon="el-icon-refresh" type="text" size="small" @click="refresh">刷新</el-button>
		<el-table
			ref="tblCustomEntityDataView"
			highlight-current-row border
			:data="records"
			style="width:100%"
			@cell-dblclick="handleFieldDblClick"
			title="双击查看或修改记录"
		>
			<el-table-column prop="guid" label="ID"></el-table-column>
			<el-table-column v-for="f in metadata!=null?metadata['fields']:null" :key="f.name" :prop="f.name" :label="f.label" show-overflow-tooltip></el-table-column>
			<el-table-column prop="opr" label="操作" fixed="right" width="60"><template slot-scope="scope">
				<el-button @click.native.prevent="records.splice(scope.$index, 1)" type="text" size="small">移除</el-button>
			</template></el-table-column>
		</el-table>
		<!--分页暂不实现
		<el-pagination
			:current-page.sync="currentPage"
			:page-sizes="[10,20,50,100]"
			:page-size="10"
			layout="sizes,prev, pager, next, jumper"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		></el-pagination>
		-->
		<el-dialog :visible.sync="recordDialogVisible" :before-close="handleCloseDlg" :title="metadata!=null?metadata['label']:''">
			<customEntityInfo :record="currentRecord" :metadata="metadata"  @infoSaved="handleInfoSaved"></customEntityInfo>
		</el-dialog>
    </div>
</template>

<script>
// 查看指定实体的数据视图
    import axios from 'axios'
	import apiBase from '../api/apiBase.js'
	import customEntityInfo from "./customEntityInfo.vue"
	import { MessageBox  } from 'element-ui';

export default {
    data() {
        return {
            baseUrl:'/api/custom_entity_data',
			metaDataEntityBaseUrl:'/api/custom_entity',
			records:[],					// 当前需要显示在表格中的数据集合
			currentRecord:null,			// 当前选中的记录
			metadata:null,				// 实体元数据信息
			currentPage:1,				// 当前页码
			recordDialogVisible:false,	// 是否显示一条记录的详情
        };
    },
	props:{
		// 实体名称
		entityName:'',
	},
	watch:{
		entityName:{
			handler(val,oldVal){
				console.log('[customEntityDataView.watch.entityName] %o->%o', oldVal, val);
				this.refresh();
			},
			deep:true,
		},
	},
    methods:{
		// 从后端拉取数据
		refresh:function(){
			console.log('[customEntityDataView.refresh(%s)]', this.entityName);
			this.currentRecord = null;
			if((this.entityName == '') || (this.entityName == null)){
				return;
			}
			// 拉取元数据定义
			axios.get(this.metaDataEntityBaseUrl + '/' + this.entityName)
                .then(function (response) {
                    console.log('[customEntityDataView.refresh(%s)]GET %o, %o',this.entityName, this.metaDataEntityBaseUrl + '/' + this.entityName, response);
					this.metadata = response.data;
					// 查询数据
					axios.get(this.baseUrl + '/' + this.entityName)
						.then(function (response) {
							console.log('[customEntityDataView.refresh(%s)]GET %o, %o', this.entityName, this.baseUrl + '/' + this.entityName, response);
							// 绑定数据
							this.records = response.data;
						}.bind(this))
						.catch(function(error){apiBase.handleAxiosError(error, this);}.bind(this));
                }.bind(this))
				.catch(function(error){apiBase.handleAxiosError(error, this);}.bind(this));
		},
		// 添加记录
		addRecord:function(){
			this.currentRecord = {guid:apiBase.newGuid()};
			this.recordDialogVisible = true;
		},
		// 字段列表双击某格
		handleFieldDblClick:function(row, column, cell, e){
			this.currentRecord = row;
			this.recordDialogVisible = true;
		},
		// 改变每页大小
		handleSizeChange(val) {
			console.log('每页%d条',val);
		},
		// 改变页
		handleCurrentChange(val) {
			console.log('当前页%d',val);
		},
		// 关闭对话框前提示
		handleCloseDlg(done){
			MessageBox.confirm('关闭前请确认已保存修改的内容', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.recordDialogVisible = false;
				this.refresh();
			}).catch(() => {
			});
		},
		// 数据保存成功后的回调函数
		handleInfoSaved(savedInfo){
			console.log('[customEntityDataView.handleInfoSaved(%s)]', this.entityName, savedInfo);
			this.recordDialogVisible = false;
			this.refresh();
		}
    },
    beforeMount(){
		this.refresh();
    },
	components:{
		customEntityInfo
	}
}
</script>

<style>
</style>
