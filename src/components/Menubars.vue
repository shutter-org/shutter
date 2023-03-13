<template>
  <div id="sidebar" class="fixed z-50 top-0 left-0 h-20 w-full border-b hidden PRO:block" aria-label="menubar top">
    <div class="w-full h-full">
      <ul class="flex flex-row space-x-2 h-full items-center">
        <li class="mr-auto">
          <router-link to="/" class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-inherit">
            <LogoAnimation />
          </router-link>
        </li>
      </ul>
    </div>
  </div>

  <div id="sidebar"
    class="fixed z-50 top-0 left-0 w-64 h-screen border-r PRO:border-t PRO:top-auto PRO:bottom-0 PRO:w-full PRO:h-20"
    aria-label="Sidebar">
    <div class="w-full p-3 h-full">
      <ul
        class="flex flex-col justify-between space-y-5 PRO:items-center PRO:flex-row PRO:space-x-2 PRO:space-y-0 PRO:h-full">
        <li class="mb-4 PRO:hidden">
          <router-link to="/" class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-inherit">
            <LogoAnimation />
          </router-link>
        </li>
        <li>
          <router-link to="/" class="flex items-center p-2 text-base font-normal rounded-lg">
            <HomeIcon />
            <span class="ml-3 whitespace-nowrap PRO:hidden">Home</span>
          </router-link>
        </li>
        <li>
          <a href="#" class="flex items-center p-2 text-base font-normal rounded-lg" @click="showModal">
            <SearchIcon />
            <span class="flex-1 ml-3 PRO:hidden">Search</span>
          </a>
          <SearchModal v-if="isShowModal" @close="closeModal" />
        </li>
        <li>
          <a href="#" class="flex items-center p-2 text-base font-normal rounded-lg">
            <ExploreIcon />
            <span class="flex-1 ml-3 whitespace-nowrap PRO:hidden">Explore</span>
          </a>
        </li>
        <li>
          <a href="#" class="flex items-center p-2 text-base font-normal rounded-lg">
            <CreateIcon />
            <span class="flex-1 ml-3 whitespace-nowrap PRO:hidden">Create</span>
          </a>
        </li>
        <li>
          <router-link to="/profile" class="flex items-center p-2 font-normal rounded-lg">
            <img class="w-6 h-6 rounded-full"
              src="https://cdn.discordapp.com/attachments/1069318680736964628/1072638173034852463/images.png"
              alt="Rounded avatar" />
            <span class="flex-1 ml-3 whitespace-nowrap PRO:hidden">Profile</span>
          </router-link>
        </li>
        <li>
          <router-link to="#" class="flex items-center p-2 text-base font-normal rounded-lg">
            <LogoutIcon />
            <span class="flex-1 ml-3 whitespace-nowrap PRO:hidden">Logout</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import HomeIcon from "@/components/icons/HomeIcon.vue";
import SearchIcon from "@/components/icons/SearchIcon.vue";
import ExploreIcon from "@/components/icons/ExploreIcon.vue";
import CreateIcon from "@/components/icons/CreateIcon.vue";
import LogoutIcon from "@/components/icons/LogoutIcon.vue";
import LogoAnimation from "@/components/LogoAnimation.vue";
import SearchModal from "@/components/SearchModal.vue";

import { ref } from 'vue'
const isShowModal = ref(false)
function closeModal() {
  isShowModal.value = false
}
function showModal() {
  isShowModal.value = true
}
</script>

<style scoped>
#sidebar {
  border-color: var(--color-border);
  background-color: var(--color-background);
}
</style>
