import { createRouter, createWebHistory } from 'vue-router'
const Home = () => import('../views/Home.vue');
const Beds = () => import('../views/Beds.vue');
const Decoration = () => import('../views/Decoration.vue');
const Furniture = () => import('../views/Furniture.vue');
const Storage = () => import('../views/Storage.vue');
const Cart = () => import('../views/Cart.vue');
const Individual_product = () => import('../views/Individual_product.vue');
const Registry = () => import('../views/Registry.vue');
const Login = () => import('../views/Login.vue');
const ProductManagement = () => import('../views/ProductManagement.vue');
const UserManagement = () => import('../views/UserManagement.vue');

const routes = [ 
    {
        path: "/",
        name : "Home",
        component: Home ,
    },
    {
        path: "/beds",
        name : "Beds",
        component: Beds ,
    },
    {
        path: "/decoration",
        name : "Decoration",
        component: Decoration ,
    },
    {
        path: "/furniture",
        name : "Furniture",
        component: Furniture ,
    },
    {
        path: "/storage",
        name : "Storage",
        component: Storage ,
    },
    {
        path: "/cart",
        name : "Cart",
        component: Cart ,
        meta: { requiresAuth: true }, 
    },
    {
        path: "/product/:id", 
        name: "Individual_product",
        component: Individual_product,
        props: true, 
        meta: { requiresAuth: true }, 
      },
      {
        path: "/register",
        name: "Register",
        component: Registry,
        meta: { guest: true }, // Mark as accessible to guests only
      },
      {
        path: "/login",
        name: "Login",
        component: Login,
        meta: { guest: true }, // Mark as accessible to guests only
      },
      {
        path: "/products",
        name: "ProductManagement",
        component: ProductManagement,
        meta: { requiresAuth: true, role: "admin" }, // Restricted to admin
      },
      {
        path: "/users",
        name: "UserManagement",
        component: UserManagement,
        meta: { requiresAuth: true, role: "admin" }, // Restricted to admin
      },
      
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  }
});

// Route Guards
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("user");

  let user = null;
  if (token) {
    try {
      user = JSON.parse(atob(token.split(".")[1])); // Decode the token to extract user data
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("user");
      return next("/login"); // Redirect to login if token is invalid
    }
  }

  // If route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      return next("/login"); // Redirect to login if not authenticated
    }

    if (to.meta.role && user && user.roles) {
      const hasRole = user.roles.includes(to.meta.role);
      if (!hasRole) {
        return next("/"); // Redirect to home if the user lacks the required role
      }
    }
    return next();
  }

  // If route is for guests only
  if (to.matched.some((record) => record.meta.guest)) {
    if (token) {
      return next("/"); // Redirect to home if already authenticated
    }
    return next();
  }

  next(); // Allow navigation if no guard is triggered
});

export default router;
