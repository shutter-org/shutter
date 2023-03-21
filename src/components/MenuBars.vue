<template>
  <div
    class=" shutter-border-color shutter-background-color fixed z-50 top-0 left-0 h-20 w-full border-b-2 hidden PRO:block"
    aria-label="menubar top">
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
    class=" shutter-border-color shutter-background-color fixed z-50 top-0 left-0 w-64 h-screen border-r-2 PRO:border-r-0 PRO:border-t-2 PRO:top-auto PRO:bottom-0 PRO:w-full PRO:h-20"
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

          <a href="#" class="flex items-center p-2 text-base font-normal rounded-lg" @click="showSearchModal">
            <SearchIcon />
            <div class="flex-1 ml-3 PRO:hidden flex justify-between">
              <span>Search</span>
              <kbd class="hx_kbd border-2 shutter-border-mute">
                <span v-if="isWindows">Ctrl K</span>
                <span v-else>&#x2318; K</span>
              </kbd>
            </div>
          </a>
          <SearchModal v-if="isSearchModalShown" @close-search-modal="closeSearchModal" />
        </li>
        <li>
          <router-link to="/explore" class="flex items-center p-2 text-base font-normal rounded-lg">
            <ExploreIcon />
            <span class="flex-1 ml-3 whitespace-nowrap PRO:hidden">Explore</span>
          </router-link>
        </li>
        <li>
          <a href="#" class="flex items-center p-2 text-base font-normal rounded-lg" @click="showCreateModal">
            <CreateIcon />
            <span class="flex-1 ml-3 whitespace-nowrap PRO:hidden">Create</span>
          </a>
        </li>
        <li>
          <router-link to="/profile" class="flex items-center p-2 font-normal rounded-lg">
            <UserIcon />
            <span class="flex-1 ml-3 whitespace-nowrap PRO:hidden">Profile</span>
          </router-link>
        </li>
        <li>
          <a id="logoutButton" href="#" class="flex items-center p-2 text-base font-normal rounded-lg" @click="logOut">
            <LogoutIcon />
            <span class="flex-1 ml-3 whitespace-nowrap PRO:hidden">Logout</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
  <PublicationCreatorModal v-if="isCreateModalShown" @close="closeCreateModal" />
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
import PublicationCreatorModal from "@/components/modals/publicationsModals/PublicationCreatorModal.vue";
import { useUserStore } from '@/stores/user'
import { ref, onMounted, onBeforeUnmount } from "vue";

const userStore = useUserStore();
const isSearchModalShown = ref(false);
const isCreateModalShown = ref(false);
const isWindows = navigator.userAgent.indexOf("Win") > -1;

const emit = defineEmits(["logOut"]);
onMounted(() => {
  document.addEventListener("keydown", onKeyDown);
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeyDown);
});

function onKeyDown(e) {
  if (navigator.userAgent.indexOf("Win") > -1) {
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      showSearchModal();
    }
  } else {
    if (e.metaKey && e.key === "k") {
      e.preventDefault();
      showSearchModal();
    }
  }
  if (e.key === "Escape") {
    closeSearchModal();
    closeCreateModal();
  }
}
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
const logOut = () => {
  emit("logOut");
}
</script>
<style>
.hx_kbd {
  display: inline-flex;
  align-items: center;
  min-width: 21px;
  padding: 0 4px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
  font-size: 12px;
  line-height: 1.5;
  color: var(--color-fg-muted);
  text-align: center;
  border-radius: 6px;
  box-shadow: none;
}
</style>