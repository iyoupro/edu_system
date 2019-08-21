<template>
  <div class="login">
    <el-row type="flex" class="form_container" justify="center">
      <el-col :span="12">
        <span>教务系统</span>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="8">
        <el-form
          :model="loginUser"
          status-icon
          :rules="rules"
          ref="loginForm"
          label-width="70px"
          class="loginForm"
        >
          <el-form-item label="用户名" prop="name">
            <el-input type="text" v-model="loginUser.name" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginUser.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="submit_btn" @click="submitForm('loginForm')">登陆</el-button>
          </el-form-item>
          <div class="tiparea">
            <p>
              还有没账号?现在
              <router-link to="/register">注册</router-link>
            </p>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import jwt_decode from 'jwt-decode';
export default {
  name: "login",
  components: {},
  data() {
    return {
      loginUser: {
        name: "",
        password: ""
      },
      rules: {
        name: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur"
          },
          {
            min: 6,
            max: 12,
            message: "长度在6到12个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不得为空",
            trigger: "blur"
          },
          {
            min: 9,
            max: 16,
            message: "长度在9到16之间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post('/api/user/login', this.loginUser)
            .then( res => {
                const { token, msg } = res.data;
                localStorage.setItem('token', token);
                const decode = jwt_decode(token);
                console.log(decode);
                this.$store.commit('update', {isAuthenticated: !this.isEmpty(decode), user:decode});
                console.log(this.$store);
                
                this.$message({
                    message: msg,
                    type:'success'
                });
                this.$router.push('/index');
            })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    isEmpty(value){
        return(
            value === undefined ||
            value === null || 
            (typeof value === 'object' && Object.keys(value).length === 0) ||
            (typeof value === 'string' && value.trim().length === 0)
        );
    }
  }
}
</script>

<style>
.login {
  position: relative;
  width: 100%;
  height: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
</style>