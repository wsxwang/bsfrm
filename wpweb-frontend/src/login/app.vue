<template>
    <div id="login">
        <el-form :model="loginform" :rules="rules" ref="loginform" label-width="100px" class="loginform">
            <h3>
                <i class="el-icon-time"></i>
                {{systitle}}
            </h3>
            <el-form-item label="用户" prop="usr">
                <el-input type="text" v-model="loginform.usr" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd">
                <el-input type="password" v-model="loginform.pwd" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="onCommit">登录</el-button>
                <el-button @click="onCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default{
        data() {
            return {
                systitle: '欢迎登录',
                //表单数据
                loginform:{
                    usr:'',
                    pwd:''
                },
                // 表单验证规则
                rules:{
                    usr: [
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
                console.log(this.loginform.usr + ":" + this.loginform.pwd);
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
