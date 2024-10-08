import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
    history: createWebHistory(),
    routes: [
     {
        path:"/admin",
        name:"dashboard",
        component: import ("@/views/Dashboard.vue")
     },
     {
        path:"/admin/manager-category",
        name:"managerCategory",
        component: import ("@/views/ManagerCategory.vue")
     },
     {
        path:"/admin/manager-product",
        name:"managerProduct",
        component: import ("@/views/ManagerProduct.vue")
     }
    ],
  });
  
  export default router;