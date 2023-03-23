<template>
  <div class="fixed inset-0 z-50 flex justify-center items-center">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full" @click="closeSearchModal"></div>
    <div
      class="shutter-modal-color relative mx-auto p-5 w-[640px] PRO:max-w-[640] shadow-lg rounded-lg PRO:mx-10 translate-x-[126px] PRO:translate-x-0 PRO:">
      <SearchComponent @close-search-modal="closeSearchModal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { searchUser } from '@/api/user';
import { searchTag } from '@/api/tag';
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import SearchComponent from '../SearchComponent.vue';

const search = ref();
const userStore = useUserStore();
const usersSearched = ref();
const tagsSearched = ref();
const isSearchingUsers = ref(true);
loadSearchedUser("");

onMounted(() => {
  document.addEventListener("keydown", onKeyDownEscape);
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeyDownEscape);
});

function onKeyDownEscape(e: KeyboardEvent) {
  if (e.key === "Escape") {
    closeSearchModal();
  }
}
watch(search, (newValue, oldValue) => {
  filterSearch(newValue);
});

function filterSearch(search: string) {
  if (search.startsWith("#")) {
    isSearchingUsers.value = false;
    loadSearchedTags(search.substring(1));
  } else {
    isSearchingUsers.value = true;
    loadSearchedUser(search);
  }
}
async function loadSearchedUser(search: string) {
  const res = await searchUser(search, userStore.authKey);
  if (res.status !== 200) {
    console.log(res);
    return;
  } else {
    const data = await res.json()
    usersSearched.value = data;
  }
}
async function loadSearchedTags(search: string) {
  const res = await searchTag(search, userStore.authKey);
  if (res.status !== 200) {
    console.log(res);
    return;
  } else {
    const data = await res.json()
    tagsSearched.value = data;
  }
}

const emit = defineEmits(["closeSearchModal"]);
function closeSearchModal() {
  emit("closeSearchModal");
}
</script>
