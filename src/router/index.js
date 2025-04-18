import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        title: "Home",
      },
    },
    {
      path: "/weather/:state/:city",
      name: "cityview",
      component: () => import("../views/CityView.vue"),
      meta: {
        title: "weather",
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  // Set the document title based on the route's meta title
  const title = to.meta.title || "Default Title";
  document.title = title;

  // Proceed to the next middleware or route
  next();
});
export default router;
