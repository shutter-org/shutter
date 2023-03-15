<template>
  <div v-if="isLoggedIn">
    <Menubars />
    <div
      class="main min-h-screen PRO:min-h-[calc(100vh-160px)] ml-64 PRO:ml-0 PRO:mb-20 PRO:mt-20"
    >
      <RouterView />
    </div>
  </div>
  <Auth v-if="!isLoggedIn" @logged-in="LoggedIn" />
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref } from "vue";
import Menubars from "@/components/Menubars.vue";
import Auth from "@/components/Auth.vue";

const isLoggedIn = ref(false);
function LoggedIn() {
  isLoggedIn.value = true;
}
</script>
<style scoped>
.main {
  background-color: var(--back-alt-color);
}
</style>
