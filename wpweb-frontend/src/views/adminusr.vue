import apiBase from "../api/apiBase";

<template>
    <div>
        <el-row>
            <el-button @click="refresh">刷新</el-button>
            <el-button @click="addUser">添加</el-button>
            <el-button @click="delUser">删除选中</el-button>
        </el-row>
        <el-row>
            <el-col :span="8">
                <div class="userTree">
                    <el-tree ref="userTree" :data="treeData" :props="treeProps" node-key="id" @node-click="handleNodeClick" show-checkbox default-expand-all highlight-current>
                    </el-tree>
                </div>
            </el-col>
            <el-col :span="16">
                <div clas ="userDetail">
                    <el-form  label-width="100px" clas ="userDetail" :model="userInfoForm" :rules="userInfoRules">
                        <el-form-item label="编号" label-width="100px"><el-input :value="userInfoForm.userGuid" :disabled="true"></el-input></el-form-item>
                        <el-form-item label="姓名" label-width="100px" prop="userName"><el-input v-model="userInfoForm.userName"></el-input></el-form-item>
                        <el-form-item label="密码" label-width="100px" prop="userPwd"><el-input v-model="userInfoForm.userPwd" type="password"></el-input></el-form-item>
                        <el-form-item><el-button @click="onSave">保存</el-button></el-form-item>
                    </el-form>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import axios from "axios"
    import apiBase from "../api/apiBase"

export default {
    data() {
        return {
            treeData:[],
            treeProps:{children:'children', label:'label'},

            // 当前选中的用户信息
            userInfoForm: {
                userGuid: '',
                userName: '',
                userPwd: '',
            },
            userInfoRules:{
                userName: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
            },


            baseUrl:'/api/users',
            users:[],
        };
    },
    methods:{
        handleNodeClick(data){
            for(var i in this.users){
                if (this.users[i]['guid'] == data['id']){
                    this.userInfoForm.userGuid = this.users[i]['guid'];
                    this.userInfoForm.userName = this.users[i]['name'];
                    this.userInfoForm.userPwd = this.users[i]['pwd'];
                }
            }
        },
        onSave(){
            var user = {guid:this.userInfoForm.userGuid, name:this.userInfoForm.userName, pwd:this.userInfoForm.userPwd};

                axios.put(this.baseUrl, user)
                    .then(function (response) {
                        console.log(response);
                        this.refresh();
                    }.bind(this))
					.catch(function(error){apiBase.handleAxiosError(error, this);}.bind(this));
        },
        refresh(){
            console.log(this.users);
            var userNodes = [];
            this.users.splice(0, this.users.length);
            console.log(this.users);
            axios.get(this.baseUrl)
                .then(function (response) {
                    console.log(response);
                    for(var i in response.data)
                    {
                        var userNode = new Object();
                        userNode['label'] = response.data[i]['name'];
                        userNode['id'] = response.data[i]['guid'];
                        userNodes.push(userNode);
                        this.users.push(JSON.parse(JSON.stringify(response.data[i])));
                    }
                }.bind(this))
				.catch(function(error){apiBase.handleAxiosError(error, this);}.bind(this));
            this.treeData=[{id:'-1',label:'root',children:userNodes}];
        },
        addUser(){
            // new id
            var newUser = {guid:apiBase.newGuid(), name:new Date().toTimeString().substr(0, 8)};
            this.users.push(newUser);
            this.treeData[0]['children'].push({id:newUser['guid'], label:newUser['name']});
            this.userInfoForm.userGuid = newUser['guid'];
            this.userInfoForm.userName = newUser['name'];
            this.userInfoForm.userPwd = newUser['pwd'];
            axios.post(this.baseUrl, newUser)
                .then(function (response) {
                    console.log(response);
                }.bind(this))
				.catch(function(error){apiBase.handleAxiosError(error, this);}.bind(this));
        },
        delUser(){
            var keys = this.$refs.userTree.getCheckedKeys();
            for(var i in keys){
                if (keys[i] == '-1'){
                    continue;
                }
                console.log("delete " + keys[i]);
                axios.delete(this.baseUrl+'/'+keys[i])
                    .then(function (response) {
                        console.log(response);
                        this.refresh();
                    }.bind(this))
				.catch(function(error){apiBase.handleAxiosError(error, this);}.bind(this));
            }
        },

    },
    mounted(){
        this.$parent.title = "aaa";
        this.refresh();
    }
}
</script>
