<template>
  <div v-if="isLoggedIn">
    <Menubars @log-out="isLoggedIn = false" />
    <div class="main ml-64 PRO:ml-0 PRO:mb-20 PRO:mt-20">
      <RouterView />
    </div>
  </div>
  <Auth v-else @logged-in="LoggedIn" />
</template>
<script setup lang="ts">
import { RouterView } from "vue-router";
import { ref } from "vue";
import Menubars from "@/components/MenuBars.vue";
import Auth from "@/components/AuthComponent.vue";
import { useUserStore } from "./stores/user";

const userStore = useUserStore();
const isLoggedIn = ref(!!userStore.authKey);
function LoggedIn() {
  isLoggedIn.value = true;
}
</script>
<style>
.main {
  background-color: var(--back-alt-color);
}

*::-webkit-scrollbar {
  display: none;
}
</style>
