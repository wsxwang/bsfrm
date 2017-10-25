<template>
    <div id="login">
        <el-form :model="loginform" :rules="rules" ref="loginform" label-width="100px" class="loginform">
            <h3>
                <i class="el-icon-time"></i>
                {{systitle}}
            </h3>
            <el-form-item label="用户" prop="user">
                <el-input type="text" v-model="loginform.user" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
                <el-input type="password" v-model="loginform.pwd" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="onCommit" type="primary" autofocus>登录</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import axios from "axios"
	import { Message } from 'element-ui';
	import apiBase from "../api/apiBase.js"
	
    export default{
        data() {
            return {
                systitle: '欢迎登录',
                //表单数据
                loginform:{
                    user:'',
                    pwd:''
                },
                // 表单验证规则
                rules:{
                    user: [
                        { required: true, message: '请输入账号', trigger: 'blur' }
                        ],
                    pwd:[
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            };
        },
        methods:{
            onCommit:function () {
                // 验证用户
                axios.get('/api/users')
                    .then(function (response) {
                        var found = false;
                        for(var i in response.data)
                        {
                            if(response.data[i]['name'] == this.loginform.user)
                            {
                                found = true;
                                if(response.data[i]['pwd'] == this.loginform.pwd) {
                                    sessionStorage.setItem('userID', response.data[i]['guid']);
                                    this.$store.commit('setUser', {
                                        userID: response.data[i]['guid'],
                                        userName: response.data[i]['name'],
                                        userPwd: response.data[i]['pwd'],
                                        });
                                    this.$router.push({path: '/content'});
                                }
                                else{
									this.$message({message:"密码不正确", type:"error"});
                                    break;
                                }
                            }
                        }
                        if (!found) {
							this.$message({message:"用户不存在", type:"error"});
                        }
                    }.bind(this))
					.catch(function(error){apiBase.handleAxiosError(error, this);}.bind(this));
            },
            onCancel:function (){
                console.log("cancel");
            }
        }
    }
</script>

<style scoped>
.loginform {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
.title {
        margin: 0px auto 40px auto;
        text-align: center;
        color: #505458;
    }
.remember {
        margin: 0px 0px 35px 0px;
    }
}
</style>
