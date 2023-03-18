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
import { ref, watch } from "vue";
import Menubars from "@/components/MenuBars.vue";
import Auth from "@/components/AuthComponent.vue";
import { useUserStore } from "./stores/user";

const userStore = useUserStore();
const isLoggedIn = ref(!!userStore.authKey);
const clock = ref(Date.now());

window.setInterval(() => {
  clock.value = Date.now();
}, 1000);

watch(() => clock.value, (newDate: number) => {
  //session d'une heure avec le serveur
  if (!Number.isNaN(userStore.sessionStartDate) && newDate - userStore.sessionStartDate >= 59 * 60 * 1000) {
    userStore.reset();
    isLoggedIn.value = false;
    console.log("session expiree");
  }
});

function LoggedIn() {
  userStore.startSession();
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
