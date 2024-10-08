<template>
  <div>
    <nav class="navbar">
      <router-link 
        to="/admin" 
        :class="{'active': isActive('/admin')}"
      >
        Dashboard
      </router-link>
      <router-link 
        to="/admin/manager-product" 
        :class="{'active': isActive('/admin/manager-product')}"
      >
        Manager Product
      </router-link>
      <router-link 
        to="/admin/manager-category" 
        :class="{'active': isActive('/admin/manager-category')}"
      >
        Manager Category
      </router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-around;
  background-color: black;
  padding: 15px;
  font-size: 18px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.navbar a {
  color: white;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 5px;
}

.navbar a:hover {
  background-color: #444;
}

.active {
  background-color: #666;
}

router-link {
  text-decoration: none;
  color: white;
}
</style>
