import Vue from "vue";
import VueRouter from "vue-router";
import Layout from "@/layout/index.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/data-overview",
    children: [
      {
        path: "data-overview",
        name: "DataOverview",
        component: () => import("@/views/dataOverview/index.vue"),
        meta: { title: "数据概览" },
      },
      {
        path: "access-record",
        name: "AccessRecord",
        component: () => import("@/views/accessRecord/index.vue"),
        meta: { title: "出入记录" },
      },
      {
        path: "organization",
        name: "Organization",
        component: () => import("@/views/organization/index.vue"),
        meta: { title: "组织架构" },
      },
      {
        path: "position",
        name: "Position",
        component: () => import("@/views/position/index.vue"),
        meta: { title: "岗位设置" },
      },
      {
        path: "level",
        name: "Level",
        component: () => import("@/views/level/index.vue"),
        meta: { title: "职级设置" },
      },
      {
        path: "account",
        name: "Account",
        component: () => import("@/views/account/index.vue"),
        meta: { title: "账号管理" },
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

export default router;
