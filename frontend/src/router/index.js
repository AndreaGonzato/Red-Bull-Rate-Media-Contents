import { createRouter, createWebHistory } from "vue-router";

import Home from "@/views/Home.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/signup",
    name: "Signup",
    component: () => import("@/views/Signup.vue"),
  },
  {
    path: "/feed",
    name: "Feed",
    component: () => import("@/views/Feed.vue"),
  },
  {
    path: "/account",
    name: "Account",
    component: () => import("@/views/Account.vue"),
  },
  {
    path: "/trend",
    name: "Trend",
    component: () => import("@/views/Trend.vue"),
  },
  {
    path: "/error/:message",
    name: "Error",
    component: () => import("@/views/Error.vue"),
  }
];


const router = createRouter({
  history: createWebHistory(),
  routes,
});


export default router;
