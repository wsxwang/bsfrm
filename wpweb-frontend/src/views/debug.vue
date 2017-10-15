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
            <p>自定义数据库及关联关系
            <el-button @click="vuex">vuex</el-button>
            </p>
        </div>
        <div id="autotest">
        </div>
    </div>
</template>

<script>
    import axios from "axios"
    import path from "path"
    import url from "url"
    import apiWSAccess from "../api/apiBase"

export default {
    data() {
        return {
            baseUrl:'http://localhost:3000',
            restfulParam:'',
            resInfo:'',
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
        vuex:function () {
            console.log(this.$store);
        }
    }

}
</script>
