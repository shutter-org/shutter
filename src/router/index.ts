import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/ProfileView.vue"),
    },
    {
      path: "/user/:username",
      name: "user",
      component: () => import("../views/UserView.vue"),
    },
    {
      path: "/explore/:tag?",
      name: "explore",
      component: () => import("../views/ExploreView.vue"),
      props: true,
    },
  ],
});

export default router;
