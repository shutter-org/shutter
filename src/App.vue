<template>
  <!-- Main page -->
  <div v-if="isLoggedIn">

    <!-- Menubar -->
    <Menubars @log-out="logOut" />

    <!-- Router view -->
    <div class="main ml-64 PRO:ml-0 PRO:mb-20 PRO:mt-20">
      <RouterView :key="$route.fullPath" />
    </div>
  </div>

  <!-- Authentification page -->
  <Auth v-else @logged-in="LoggedIn" />
</template>

<script setup lang="ts">
import { ping } from "./api/auth";
import { RouterView } from "vue-router";
import { ref, watch } from "vue";
import { useUserStore } from "./stores/user";
import { usePublicationStore } from "./stores/publication";
import { useGalleryStore } from "./stores/gallery";
import Menubars from "@/components/MenuBars.vue";
import Auth from "@/components/AuthComponent.vue";
import router from "./router";

const userStore = useUserStore();
const publicationStore = usePublicationStore();
const galleryStore = useGalleryStore();
const isLoggedIn = ref(!!userStore.authKey);
const clock = ref(Date.now());

window.setInterval(() => {
  clock.value = Date.now();
}, 1000);

watch(() => clock.value, (newDate: number) => {
  //session d'une heure avec le serveur
  if (!Number.isNaN(userStore.sessionStartDate) && newDate - userStore.sessionStartDate >= 59 * 60 * 1000) {
    logOut();
  }
});

pingServer();

async function pingServer() {
  if (isLoggedIn.value) {
    const res = await ping(userStore.authKey);
    if (res.status !== 200) {
      logOut();
    }
  }
}
function LoggedIn() {
  userStore.startSession();
  isLoggedIn.value = true;
}
function logOut() {
  userStore.reset();
  publicationStore.reset();
  galleryStore.reset();
  isLoggedIn.value = false;
  router.push("/");
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
