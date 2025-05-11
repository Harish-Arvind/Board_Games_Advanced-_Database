import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue"; // ✅ Make sure the file exists!
import GameDetails from "../views/GameDetails.vue"; // You may need to create this too.

const routes = [
  { path: "/", component: Home },
  { path: "/game/:id", component: GameDetails }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
