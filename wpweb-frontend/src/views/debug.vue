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
				<h1>{{chosenVue=='adminequ'?'display:block':'display:none'}}</h1>
				
				 <div :style="chosenVue=='adminequ'?'display:block':'display:none'"><adminequ></adminequ></div>
				 <div :style="chosenVue=='adminusr'?'display:block':'display:none'"><adminusr></adminusr></div>
				 <div :style="chosenVue=='login'?'display:block':'display:none'"><login></login></div>
				 <div :style="chosenVue=='nav_panel'?'display:block':'display:none'"><nav_panel></nav_panel></div>
				 <div :style="chosenVue=='projectBaseInfo'?'display:block':'display:none'"><projectBaseInfo></projectBaseInfo></div>
				 <div :style="chosenVue=='projectMgr'?'display:block':'display:none'"><projectMgr></projectMgr></div>
				 <div :style="chosenVue=='taskDetail'?'display:block':'display:none'"><taskDetail></taskDetail></div>
				 <div :style="chosenVue=='taskMgr'?'display:block':'display:none'"><taskMgr></taskMgr></div>
			</p>
        </div>
        <div id="autotest">
        </div>
    </div>
</template>

<script>
    import axios from "axios"
	import adminequ from "./adminequ.vue"
	import adminusr from "./adminusr.vue"
	import login from "./login.vue"
	import nav_panel from "./nav_panel.vue"
	import projectBaseInfo from "./projectBaseInfo.vue"
	import projectMgr from "./projectMgr.vue"
	import taskDetail from "./taskDetail.vue"
	import taskMgr from "./taskMgr.vue"
	
	var vues

export default {
    data() {
        return {
            baseUrl:'http://localhost:3000',
            restfulParam:'',
            resInfo:'',
			
			chosenVue:'adminequ',
			vueNames:[
				'adminequ',
				'adminusr',
				'login',
				'nav_panel',
				'projectBaseInfo',
				'projectMgr',
				'taskDetail',
				'taskMgr',
			],
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
		adminequ,
		adminusr,
		login,
		nav_panel,
		projectBaseInfo,
		projectMgr,
		taskDetail,
		taskMgr,
	},
}
</script>
