<template>
  <aside
    id="default-sidebar"
    class="fixed top-0 left-0 z-40 w-64 h-screen"
    aria-label="Sidebar"
  >
    <div class="h-full px-3 py-4 overflow-y-auto">
      <ul class="space-y-2">
        <li class="mb-4">
          <router-link
            to="/"
            class="flex items-center p-2 text-base font-normal rounded-lg"
          >
            <span id="logo-name" class="ml-1 font-semibold text-3xl"
              >Shutter</span
            >
          </router-link>
        </li>
        <li>
          <router-link
            to="/"
            class="flex items-center p-2 text-base font-normal rounded-lg"
          >
            <HomeIcon />
            <span class="ml-3 whitespace-nowrap">Home</span>
          </router-link>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-base font-normal rounded-lg"
          >
            <SearchIcon />
            <span class="flex-1 ml-3 whitespace-nowrap">Search</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-base font-normal rounded-lg"
          >
            <ExploreIcon />
            <span class="flex-1 ml-3 whitespace-nowrap">Explore</span>
          </a>
        </li>
        <li>
          <router-link
            to="/inbox"
            class="flex items-center p-2 text-base font-normal rounded-lg"
          >
            <InboxIcon />
            <span class="flex-1 ml-3 whitespace-nowrap">Messages</span>
          </router-link>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-base font-normal rounded-lg"
          >
            <NotificationsIcon />
            <span class="flex-1 ml-3 whitespace-nowrap">Notifications</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-base font-normal rounded-lg"
          >
            <CreateIcon />
            <span class="flex-1 ml-3 whitespace-nowrap">Create</span>
          </a>
        </li>
        <li>
          <router-link
            to="/profile"
            class="flex items-center p-2 font-normal rounded-lg"
          >
            <img
              class="w-6 h-6 rounded-full"
              src="https://cdn.discordapp.com/attachments/1069318680736964628/1072638173034852463/images.png"
              alt="Rounded avatar"
            />
            <span class="flex-1 ml-3 whitespace-nowrap">Profile</span>
          </router-link>
        </li>
      </ul>
      <a
        href="#"
        class="absolute bottom-0 mb-8 flex items-center p-2 font-normal rounded-lg"
      >
        <LogoutIcon />
        <span class="flex-1 ml-3 whitespace-nowrap">Logout</span>
      </a>
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
import LogoutIcon from "./components/icons/LogoutIcon.vue";
</script>
<style scoped>
@media (max-width: 1264px) {
  #default-sidebar {
    width: 64px;
  }
  .whitespace-nowrap {
    display: none;
  }
  #logo-name {
    display: none;
  }
}
#default-sidebar {
  border-right: 1px solid rgba(84, 84, 84, 0.65);
}
</style>
