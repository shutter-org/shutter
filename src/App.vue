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
import { signIn } from "./api/auth";
import type { SignInUser } from "./api/auth";

const userStore = useUserStore();
if (!!userStore.username && !!userStore.password) {
  tryProlongingSessions();
}
const isLoggedIn = ref(!!userStore.authKey);

async function tryProlongingSessions() {
  const newUser: SignInUser = {
    username: userStore.username,
    password: userStore.password,
  };
  const res = await signIn(newUser)
  if (res.status === 200) {
    const data = await res.json();
    userStore.authKey = data.acces_token;
  }
  else {
    userStore.authKey = "";
  }
}
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
