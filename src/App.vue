<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <button>Search</button>
      <RouterLink to="/inbox">Inbox</RouterLink>
      <button>Create</button>
      <RouterLink to="/profile">Profile</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>
<style scoped></style>
