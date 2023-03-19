<template>
  <div
    class="shutter-background-mute min-h-screen PRO:min-h-[calc(100vh-160px)] w-full p-10 max-w-7xl ml-auto mr-auto flex flex-col gap-8">
    <div
      class="shutter-border-color shutter-background-color w-full flex flex-col gap-2 items-center rounded-lg p-4 border-2 h-full">
      <!-- <SearchComponent /> -->
      <a href="#" class="flex items-center p-2 text-base font-normal rounded-lg" @click="openSearchModal">
        <SearchIcon />
        <span class="flex-1 ml-3 PRO:hidden">Search</span>
      </a>
      <div class="flex flex-wrap justify-center gap-4">
        <button class="w-80" v-for="publication in shownPublications"
          @click="openPublicationModal(publication.publication_id)">
          <img class="w-full object-cover aspect-square rounded-lg" :src="publication.picture" />
        </button>
        <PublicationModal v-if="isPublicationModalShown" @close="closePublicationModal"
          :publication-id="shownPublicationId" :is-current-user="loggedUsername === shownPublication.poster_user.username"
          @delete="deletePublication" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import PublicationModal from "@/components/modals/PublicationModal.vue";
import SearchIcon from "@/components/icons/menu/SearchIcon.vue";
import { ref } from "vue";
import { getPublicationByTag } from "@/api/publication";
import { useUserStore } from "@/stores/user";
import type { Publication } from "@/api/type";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const route = useRoute();
const isPublicationModalShown = ref(false);
const shownPublications = ref<Publication[]>([]);
const shownPublicationId = ref();
const shownPublication = ref();
const loggedUsername = userStore.username;

searchPublicationByTag(route.params.tag.toString(), 1);

const emit = defineEmits(["openSearchModal"]);
function openSearchModal() {
  emit("openSearchModal")
  console.log("showing search modal");
}

async function searchPublicationByTag(tag: string, number: number) {
  const res = await getPublicationByTag(number, tag, userStore.authKey);
  if (res.status !== 200) {
    console.log(res);
    return;
  } else {
    const data = await res.json()
    shownPublications.value = data;
  }
}

const openPublicationModal = (publicationId: string) => {
  console.log(publicationId);
  shownPublicationId.value = publicationId;
  shownPublication.value = shownPublications.value.find((publication: Publication) => {
    return publication.publication_id === publicationId;
  });
  isPublicationModalShown.value = true;
};
const closePublicationModal = () => {
  isPublicationModalShown.value = false;
};
const deletePublication = (publicationId: string) => {
  console.log("deleting publication");
  shownPublications.value = shownPublications.value.filter((publication: Publication) => {
    return publication.publication_id !== publicationId;
  });
}



</script>
