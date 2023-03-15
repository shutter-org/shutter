<template>
  <div
    id="sidebar"
    class="fixed z-50 top-0 left-0 h-20 w-full border-b hidden PRO:block"
    aria-label="menubar top"
  >
    <div class="w-full h-full">
      <ul class="flex flex-row space-x-2 h-full items-center">
        <li class="mr-auto">
          <router-link
            to="/"
            class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-inherit"
          >
            <LogoAnimation />
          </router-link>
        </li>
      </ul>
    </div>
  </div>

  <div
    id="sidebar"
    class="fixed z-50 top-0 left-0 w-64 h-screen border-r PRO:border-t PRO:top-auto PRO:bottom-0 PRO:w-full PRO:h-20"
    aria-label="Sidebar"
  >
    <div class="w-full p-3 h-full">
      <ul
        class="flex flex-col justify-between space-y-5 PRO:items-center PRO:flex-row PRO:space-x-2 PRO:space-y-0 PRO:h-full"
      >
        <li class="mb-4 PRO:hidden">
          <router-link
            to="/"
            class="flex items-center p-2 text-base font-normal rounded-lg hover:bg-inherit"
          >
            <LogoAnimation />
          </router-link>
        </li>
        <li>
          <router-link
            to="/"
            class="flex items-center p-2 text-base font-normal rounded-lg"
          >
            <HomeIcon />
            <span class="ml-3 whitespace-nowrap PRO:hidden">Home</span>
          </router-link>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-base font-normal rounded-lg"
            @click="showSearchModal"
          >
            <SearchIcon />
            <span class="flex-1 ml-3 PRO:hidden">Search</span>
          </a>
          <SearchModal v-if="isSearchModalShown" @close="closeSearchModal" />
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-base font-normal rounded-lg"
          >
            <ExploreIcon />
            <span class="flex-1 ml-3 whitespace-nowrap PRO:hidden"
              >Explore</span
            >
          </a>
        </li>
        <li>
          <a
            href="#"
            class="flex items-center p-2 text-base font-normal rounded-lg"
            @click="showCreateModal"
          >
            <CreateIcon />
            <span class="flex-1 ml-3 whitespace-nowrap PRO:hidden">Create</span>
          </a>
          <PublicationCreatorModal
            v-if="isCreateModalShown"
            @close="closeCreateModal"
            :user="user1"
          />
        </li>
        <li>
          <router-link
            to="/profile"
            class="flex items-center p-2 font-normal rounded-lg"
          >
            <UserIcon />
            <span class="flex-1 ml-3 whitespace-nowrap PRO:hidden"
              >Profile</span
            >
          </router-link>
        </li>
        <li>
          <router-link
            to="#"
            class="flex items-center p-2 text-base font-normal rounded-lg"
          >
            <LogoutIcon />
            <span class="flex-1 ml-3 whitespace-nowrap PRO:hidden">Logout</span>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import HomeIcon from "@/components/icons/menu/HomeIcon.vue";
import SearchIcon from "@/components/icons/menu/SearchIcon.vue";
import ExploreIcon from "@/components/icons/menu/ExploreIcon.vue";
import CreateIcon from "@/components/icons/CreateIcon.vue";
import UserIcon from "@/components/icons/menu/UserIcon.vue";
import LogoutIcon from "@/components/icons/menu/LogoutIcon.vue";
import LogoAnimation from "@/components/LogoAnimation.vue";
import SearchModal from "@/components/modals/SearchModal.vue";
import PublicationCreatorModal from "@/components/modals/PublicationCreatorModal.vue";

import { ref } from "vue";

const isSearchModalShown = ref(false);
const isCreateModalShown = ref(false);

const user1 = {
  id: "u1",
  username: "Blond141",
  profile_picture:
    "https://h5p.org/sites/default/files/h5p/content/1209180/images/file-6113d5f8845dc.jpeg",
};
function closeSearchModal() {
  isSearchModalShown.value = false;
}
function showSearchModal() {
  isSearchModalShown.value = true;
}
function closeCreateModal() {
  isCreateModalShown.value = false;
}
function showCreateModal() {
  isCreateModalShown.value = true;
}
</script>

<style scoped>
#sidebar {
  border-right-width: 2px;
  border-color: var(--color-border);
  background-color: var(--color-background);
}
</style>
