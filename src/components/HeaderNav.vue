<template>
  <header class="head-nav">
    <el-row type="flex">
      <el-col :span="4">
        <span class="title">教务系统</span>
      </el-col>
      <el-col :span="20">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          router
          @select="handleSelect"
        >
          <template v-for="item in $router.options.routes" v-if="item.menuShow">
            <el-submenu :index="item.path" :key="item.path" v-if="item.children">
              <template slot="title">{{item.menuName}}</template>
              <el-menu-item
                v-for="(itemChild , index) in item.children"
                :index="itemChild.path"
                :key="index"
                :v-if="itemChild.menuShow"
              >
                <span>{{itemChild.menuName}}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item :index="item.path" :key='item.path' v-else>{{item.menuName}}</el-menu-item>
          </template>
          <template v-if="this.$store.state.isAuthenticated">
              <el-menu-item class="user-status">
                  <span>Welcome </span>
                  <span>{{this.$store.state.user.name}}</span>
                </el-menu-item>
          </template>
          <template v-else>
              <el-menu-item index="/register" class="user-status"><span>Register</span></el-menu-item>
              <el-menu-item index="/login" class="user-status"><span>Login</span></el-menu-item>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </header>
</template>
<script>
export default {
  name: "HeadNav"
};
</script>

<style scoped>
.user-status{
    float: right !important;
}
</style>