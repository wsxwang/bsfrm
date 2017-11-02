<template>
    <div>
        <el-tabs activeName="tab1" type="card">
            <el-tab-pane label="信息" name="tab1">
				<el-form label-width="100px" :model="entityItemForm" :rules="entityItemRules">
					{{entity_metadata!=null?entity_metadata.label:'未查找到元数据'+entity_name}}
					<el-form-item label="guid" title="GUID为唯一编号，空表示新增一条数据"><el-input :value="entityItemForm.guid" :disabled="true"></el-input></el-form-item>
					<el-form-item v-for="item in (entity_metadata!=null?entity_metadata.fields:null)" :key="item['name']" :label="item['label']" :title="item['title']">
						<el-input v-model="entityItemForm[item['name']]"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="refresh">刷新</el-button>
						<el-button @click="onSaveInfo">保存</el-button>
					</el-form-item>
				</el-form>
            </el-tab-pane>
            <el-tab-pane key="custom_relation" label="关联" name="tab2">
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
			metaDataEntityBaseUrl:'/api/custom_entity',
			
			next:{item:null, metaData:null},
			previous:{item:null, metaData:null},
			
            entityItemForm: {},
            entityItemRules:{},
			entity_metadata:null,
        };
    },
	props:{
		// 元数据，null或''则不做任何事，若为字符串则表示实体名称，需要从服务端拉取元数据定义
		entity_meta
		// 一个实体记录，null或''表示需要新建，若为字符串表示记录的guid，需要从服务端拉取数据
		item:null,
	
	
		// 一个实体项目的guid
		item_guid:'',
		// 元数据定义的名称
		entity_name:'',
	},
	watch:{
		item_guid:{
			handler(val,oldVal){
				console.log('[customEntityInfo.watch.item_guid] %o->%o', oldVal, val);
				this.refresh();
			},
			deep:true,
		},
		entity_name:{
			handler(val,oldVal){
				console.log('[customEntityInfo.watch.entity_name] %o->%o', oldVal, val);
				this.refresh();
			},
			deep:true,
		},
	},
    methods:{
		// 从后端拉取数据
		refresh:function(){
			console.log('[customEntityInfo.refresh()] %o, %o', this.item_guid, this.entity_name);

			if((this.entity_name == '') || (this.entity_name == null)){
				return;
			}
			// 拉取元数据定义
			axios.get(this.metaDataEntityBaseUrl + '/' + this.entity_name)
                .then(function (response) {
                    console.log('[customEntityInfo.refresh()] GET %o, %o', this.metaDataEntityBaseUrl + '/' + this.entity_name, response);
					this.entity_metadata = response.data;

					// 元数据绑定控件
					for(var i in (this.entity_metadata!=null?this.entity_metadata.fields:null)){
						if (this.entityItemForm[this.entity_metadata.fields[i]['name']] == null){
							this.entityItemForm[this.entity_metadata.fields[i]['name']] = '';
						}
					}
					
					if((this.item_guid == '') || (this.item_guid == null)){
						return;
					}
					this.entityItemForm.guid = this.item_guid;

					// 查询数据
					axios.get(this.baseUrl + '/' + this.entity_metadata['name'] + "/" + this.item_guid)
						.then(function (response) {
							console.log('[customEntityInfo].refresh()] GET %o, %o', this.baseUrl + '/' + this.item_guid, response);
							// 绑定数据
							for(var i in this.entityItemForm){
								this.entityItemForm[i] = response.data[i];
							}
						}.bind(this))
						.catch(function(error){apiBase.handleAxiosError(error, this);}.bind(this));
                }.bind(this))
				.catch(function(error){apiBase.handleAxiosError(error, this);}.bind(this));
		},
		// 更新或新增数据
        onSaveInfo:function () {
			console.log('[customEntityInfo.onSaveInfo()] %o',this.entityItemForm);
        },
    },
    mounted(){
		this.refresh();
    }
}
</script>

<style>
</style>
