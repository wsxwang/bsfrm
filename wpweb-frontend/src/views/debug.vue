<template>
    <div>
        <div>
            <p>restful api test
                <el-input :placeholder="baseUrl" v-model="baseUrl" @change="baseUrlChanged"></el-input>
                <el-input placeholder="参数" v-model="restfulParam"></el-input>
                <el-button @click="methodGet" title="无参表示所有">读取：GET</el-button>
                <el-button @click="methodDelete" title="必须有参数">删除：DELETE</el-button>
                <el-button @click="methodPost" title="必须有参数">创建：POST</el-button>
                <el-button @click="methodPut" title="必须有参数">更新：PUT</el-button>
                <el-button @click="methodOptions">选项：OPTIONS</el-button>
            </p>
            <el-input type="textarea" v-model="resInfo" :autosize="{minRows:2,maxRows:10}"></el-input>
        </div>
        <div>
            <p>vue组件测试
			    <el-select v-model="chosenVue" placeholder="...">
					<el-option v-for="item in vueNames" :key="item" :label="item" :value="item"></el-option>
				</el-select>
			    <div :style="chosenVue=='adminCustom'?'display:block':'display:none'"><adminCustom></adminCustom></div>
                <div :style="chosenVue=='adminequ'?'display:block':'display:none'">
					<adminequ></adminequ>
				</div>
				<div :style="chosenVue=='adminusr'?'display:block':'display:none'"><adminusr></adminusr></div>
				<div :style="chosenVue=='customEntityDataView'?'display:block':'display:none'">
					<el-input placeholder="entity name" v-model="entityName"></el-input>
					<customEntityDataView :entityName="entityName"></customEntityDataView>
				</div>
				<div :style="chosenVue=='login'?'display:block':'display:none'"><login></login></div>
				<div :style="chosenVue=='nav_panel'?'display:block':'display:none'"><nav_panel></nav_panel></div>
			</p>
        </div>
        <div id="autotest">
        </div>
    </div>
</template>

<script>
    import axios from "axios"
    import adminCustom from "./adminCustom.vue"
	import adminequ from "./adminequ.vue"
	import adminusr from "./adminusr.vue"
	import customEntityDataView from "./customEntityDataView.vue"
	import customEntityInfo from "./customEntityInfo.vue"
	import login from "./login.vue"
	import nav_panel from "./nav_panel.vue"
	
	var vues

export default {
    data() {
        return {
            baseUrl:'http://localhost:3000',
            restfulParam:'',
            resInfo:'',
			
			chosenVue:'adminCustom',
			vueNames:[
			    'adminCustom',
				'adminequ',
				'adminusr',
				'customEntityDataView',
				'login',
				'nav_panel',
			],
			
			entityName:'',
        };
    },
    methods:{
        baseUrlChanged:function () {
            axios.defaults.baseURL=this.baseUrl;
            console.log(this.baseUrl);
        },
        methodDelete:function(){
            axios.delete(this.restfulParam)
                .then(function (response) {
                    this.resInfo = JSON.stringify(response);
                    console.log(response);
                }.bind(this))
                .catch(function (error) {
                    this.resInfo = JSON.stringify(error);
                    console.error(error);
                }.bind(this));
        },
        methodGet:function(){
            axios.get(this.restfulParam)
                .then(function (response) {
                    this.resInfo = JSON.stringify(response);
                    console.log(response);
                }.bind(this))
                .catch(function (error) {
                    this.resInfo = JSON.stringify(error);
                    console.error(error);
                }.bind(this));
        },
        methodPost:function(){
            axios.post(this.baseUrl, JSON.parse(this.restfulParam))
                .then(function (response) {
                    this.resInfo = JSON.stringify(response);
                    console.log(response);
                }.bind(this))
                .catch(function (error) {
                    this.resInfo = JSON.stringify(error);
                    console.error(error);
                }.bind(this));
        },
        methodPut:function(){
            axios.put(this.baseUrl, JSON.parse(this.restfulParam))
                .then(function (response) {
                    this.resInfo = JSON.stringify(response);
                    console.log(response);
                }.bind(this))
                .catch(function (error) {
                    this.resInfo = JSON.stringify(error);
                    console.error(error);
                }.bind(this));
        },
        methodOptions:function(){
            axios.options()
                .then(function (response) {
                    this.resInfo = JSON.stringify(response);
                    console.log(response);
                }.bind(this))
                .catch(function (error) {
                    this.resInfo = JSON.stringify(error);
                    console.error(error);
                }.bind(this));
        },
    },
	components:{
        adminCustom,
		adminequ,
		adminusr,
		customEntityDataView,
		customEntityInfo,
		login,
		nav_panel,
	},
}
</script>
