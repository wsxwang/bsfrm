<template>
    <div>
        <el-tabs activeName="tab1" type="card">
            <el-tab-pane label="信息" name="tab1">
				<el-form label-width="100px" :model="entityItemForm" :rules="entityItemRules">
					{{item_metadata!=null?item_metadata.label:'未查找到元数据'+item_metadata_name}}
					<el-form-item label="guid" title="GUID为唯一编号，空表示新增一条数据"><el-input :value="entityItemForm.guid" :disabled="true"></el-input></el-form-item>
					<el-form-item v-for="item in (item_metadata!=null?item_metadata.fields:null)" :key="item['name']" :label="item['label']" :title="item['title']">
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

export default {
    data() {
        return {
            baseUrl:'/api/custom_entity_data',
			metaDataEntityBaseUrl:'/api/custom_entity',
			
			next:{item:null, metaData:null},
			previous:{item:null, metaData:null},
			
            entityItemForm: {},
            entityItemRules:{},
			item_metadata:null,
        };
    },
	props:{
		// 一个实体项目的guid
		item_guid:'',
		// 元数据定义的名称
		item_metadata_name:'',
	},
	watch:{
		item_guid:{
			handler(val,oldVal){
				console.log('[customEntityInfo.watch.item_guid] %o->%o', oldVal, val);
				this.refresh();
			},
			deep:true,
		},
		item_metadata_name:{
			handler(val,oldVal){
				console.log('[customEntityInfo.watch.item_metadata_name] %o->%o', oldVal, val);
				this.refresh();
			},
			deep:true,
		},
	},
    methods:{
		// 从后端拉取数据
		refresh:function(){
			console.log('[customEntityInfo.refresh()] %o, %o', this.item_guid, this.item_metadata_name);
			if((this.item_guid == '') || (this.item_guid == null)){
				return;
			}
			if((this.item_metadata_name == '') || (this.item_metadata_name == null)){
				return;
			}
						
			// 拉取元数据定义
			axios.get(this.metaDataEntityBaseUrl + '/' + this.item_metadata_name)
                .then(function (response) {
                    console.log('[customEntityInfo.refresh()] GET %o, %o', this.metaDataEntityBaseUrl + '/' + this.item_metadata_name, response);
					this.item_metadata = response.data;
					
					// 元数据绑定控件
					for(var i in (this.item_metadata!=null?this.item_metadata.fields:null)){
						if (this.entityItemForm[this.item_metadata.fields[i]['name']] == null){
							this.entityItemForm[this.item_metadata.fields[i]['name']] = '';
						}
					}

					// 查询数据
					axios.get(this.baseUrl + '/' + this.item_metadata['name'] + "/" + this.item_guid)
						.then(function (response) {
							console.log('[customEntityInfo].refresh()] GET %o, %o', this.baseUrl + '/' + this.item_guid, response);
							// 绑定数据
							for(var i in this.entityItemForm){
								this.entityItemForm[i] = response.data[i];
							}
						}.bind(this))
						.catch(function (error) {
							alert(error);
							console.log('[customEntityInfo.refresh()] GET %o, %o', this.baseUrl + '/' + this.item_guid, error);
						}.bind(this));
					
                }.bind(this))
                .catch(function (error) {
                    alert(error);
                    console.log('[customEntityInfo.refresh()] GET %o, %o', this.metaDataEntityBaseUrl + '/' + this.item_metadata_name, error);
                }.bind(this));
			
			// 拉取数据信息
		},
		// 更新或新增数据
        onSaveInfo:function () {
			console.log('[customEntityInfo.onSaveInfo()] %o',this.entityItemForm);
        },
    },
    mounted(){
	console.log("bbbbbb");
		this.refresh();
    }
}
</script>

<style>
</style>
