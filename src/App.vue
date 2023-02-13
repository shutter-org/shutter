<template>
  <aside
    id="default-sidebar"
    class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
      <ul class="space-y-2">
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <HomeIcon />
            <span class="ml-3">Home</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <SearchIcon />
            <span class="flex-1 ml-3 whitespace-nowrap">Search</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ExploreIcon />
            <span class="flex-1 ml-3 whitespace-nowrap">Explore</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <InboxIcon />
            <span class="flex-1 ml-3 whitespace-nowrap">Messages</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <NotificationsIcon />
            <span class="flex-1 ml-3 whitespace-nowrap">Notifications</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <CreateIcon />
            <span class="flex-1 ml-3 whitespace-nowrap">Create</span>
          </a>
        </li>
      </ul>
    </div>
  </aside>
  <RouterView />
</template>
<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HomeIcon from "./components/icons/HomeIcon.vue";
import SearchIcon from "./components/icons/SearchIcon.vue";
import ExploreIcon from "./components/icons/ExploreIcon.vue";
import InboxIcon from "./components/icons/InboxIcon.vue";
import NotificationsIcon from "./components/icons/NotificationsIcon.vue";
import CreateIcon from "./components/icons/CreateIcon.vue";
</script>
<style scoped></style>
