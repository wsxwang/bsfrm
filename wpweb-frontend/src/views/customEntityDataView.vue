<template>
    <div>
		<el-button icon="plus" type="text" size="small" @click="records.push({guid:''})">添加</el-button>
		<el-button icon="delete" type="text" size="small" @click="alert('delete')">删除选中</el-button>
		<el-button icon="refresh" type="text" size="small" @click="refresh">刷新</el-button>
		<el-table :data="records" border style="width:100%" @cell-dblclick="handleFieldDblClick"   title="双击表格修改。">
			<el-table-column prop="guid" label="ID"></el-table-column>
			<el-table-column v-for="f in entity_metadata['fields']" :key="f.name" :prop="f.name" :label="f.label"></el-table-column>
			<el-table-column prop="opr" label="操作" fixed="right" width="80"><template slot-scope="scope">
				<el-button @click.native.prevent="records.splice(scope.$index, 1)" type="text" size="small" title="remove one record">移除</el-button>
			</template></el-table-column>
		</el-table>
    </div>
</template>

<script>
// 查看指定实体的数据视图
    import axios from 'axios'
	import apiBase from '../api/apiBase.js'

export default {
    data() {
        return {
            baseUrl:'/api/custom_entity_data',
			metaDataEntityBaseUrl:'/api/custom_entity',
			records:[],
			entity_metadata:{},
        };
    },
	props:{
		// 实体名称
		entity_name:'',
	},
	watch:{
		entity_name:{
			handler(val,oldVal){
				console.log('[customEntityDataView.watch.entity_name] %o->%o', oldVal, val);
				this.refresh();
			},
			deep:true,
		},
	},
    methods:{
		// 从后端拉取数据
		refresh:function(){
			console.log('[customEntityDataView.refresh()]%o', this.item_guid, this.entity_name);
			if((this.entity_name == '') || (this.entity_name == null)){
				return;
			}
						
			// 拉取元数据定义
			axios.get(this.metaDataEntityBaseUrl + '/' + this.entity_name)
                .then(function (response) {
                    console.log('[customEntityDataView.refresh()] GET %o, %o', this.metaDataEntityBaseUrl + '/' + this.entity_name, response);
					this.entity_metadata = response.data;
					// 查询数据
					axios.get(this.baseUrl + '/' + this.entity_name)
						.then(function (response) {
							console.log('[customEntityDataView.refresh()] GET %o, %o', this.baseUrl + '/' + this.entity_name, response);
							// 绑定数据
							this.records = response.data;
						}.bind(this))
						.catch(function(error){apiBase.handleAxiosError(error, this);}.bind(this));
                }.bind(this))
				.catch(function(error){apiBase.handleAxiosError(error, this);}.bind(this));
		},
		// 更新或新增数据
        onSaveInfo:function () {
			console.log('[customEntityInfo.onSaveInfo()] %o',this.entityItemForm);
        },
		// 字段列表双击某格
		handleFieldDblClick:function(row, column, cell, e){
			alert("double click");
		},
    },
    mounted(){
		this.refresh();
    }
}
</script>

<style>
</style>
