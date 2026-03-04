<template>
  <el-container style="min-height: 100vh">
    <el-aside
      :width="isCollapse ? '64px' : '200px'"
      style="background-color: #304156; transition: width 0.3s"
    >
      <div class="logo" :class="{ collapse: isCollapse }">智慧停车</div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :collapse-transition="false"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        unique-opened
        router
      >
        <el-menu-item index="/data-overview">
          <i class="el-icon-s-data"></i>
          <span slot="title">数据概览</span>
        </el-menu-item>
        <el-menu-item index="/access-record">
          <i class="el-icon-tickets"></i>
          <span slot="title">出入记录</span>
        </el-menu-item>
        <el-menu-item index="/organization">
          <i class="el-icon-s-operation"></i>
          <span slot="title">组织架构</span>
        </el-menu-item>
        <el-menu-item index="/position">
          <i class="el-icon-s-custom"></i>
          <span slot="title">岗位设置</span>
        </el-menu-item>
        <el-menu-item index="/level">
          <i class="el-icon-s-order"></i>
          <span slot="title">职级设置</span>
        </el-menu-item>
        <el-menu-item index="/account">
          <i class="el-icon-user"></i>
          <span slot="title">账号管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header
        style="
          background: #fff;
          box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
          display: flex;
          align-items: center;
        "
      >
        <i
          :class="['el-icon-s-fold', { 'is-collapse': isCollapse }]"
          @click="toggleCollapse"
          style="font-size: 20px; cursor: pointer; margin-right: 20px"
        ></i>
        <span style="font-weight: 600">{{ $route.meta.title }}</span>
      </el-header>
      <el-main style="background-color: #f5f7fa; padding: 20px">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: false,
    };
  },
  computed: {
    activeMenu() {
      return this.$route.path;
    },
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style scoped>
.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background-color: #1f2d3a;
  overflow: hidden;
  white-space: nowrap;
}
.logo.collapse {
  font-size: 14px;
  padding: 0 5px;
}
.el-aside {
  overflow: hidden;
}
.el-menu {
  border-right: none;
}
.is-collapse {
  transform: rotate(90deg);
}
</style>
