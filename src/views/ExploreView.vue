<template>
  <div
    class="shutter-background-mute min-h-screen PRO:min-h-[calc(100vh-160px)] w-full p-10 max-w-7xl ml-auto mr-auto flex flex-col gap-8">
    <div v-if="!isLoading"
      class="shutter-border-color shutter-background-color w-full flex flex-col gap-2 items-center rounded-lg p-4 border-2 h-full">
      <span class="flex-1 ml-3 text-4xl" v-if="!isTagNameEmpty">#{{ route.params.tag }}</span>
      <div class="flex flex-wrap justify-center gap-4">
        <button class="w-80" v-for="publication in shownPublications"
          @click="openPublicationModal(publication.publication_id)">
          <img class="w-full object-cover aspect-square rounded-lg" :src="publication.picture" />
        </button>
        <div v-if="isTagPublicationsEmpty"
          class="flex flex-col m-auto items-center p-10 rounded-lg border-2 shutter-border-color shutter-background-color">
          <SadIcon class="w-40 h-40"></SadIcon>
          <p class="text-3xl">Tag has no posts...</p>
        </div>
        <PublicationModal v-if="isPublicationModalShown" @close="closePublicationModal"
          :publication-id="shownPublicationId" :is-current-user="loggedUsername === shownPublication.poster_user.username"
          @delete="deletePublication" />
      </div>
    </div>
    <SyncLoader v-if="isLoading" color="#465A82" size="24px" class="m-auto" />
  </div>
</template>
<script setup lang="ts">
import PublicationModal from "@/components/modals/PublicationModal.vue";
import SyncLoader from "vue-spinner/src/SyncLoader.vue"
import SadIcon from "@/components/icons/SadIcon.vue";
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
const isTagNameEmpty = ref(true);
const isTagPublicationsEmpty = ref(false);
const isLoading = ref(true);


searchPublicationByTag(route.params.tag.toString(), 1);
if (route.params.tag.toString() !== "") {
  isTagNameEmpty.value = false;

}

async function searchPublicationByTag(tag: string, number: number) {
  const res = await getPublicationByTag(number, tag, userStore.authKey);
  if (res.status !== 200) {
    isTagPublicationsEmpty.value = true;
    isLoading.value = false;
    return;
  } else {
    const data = await res.json()
    shownPublications.value = data;
    isLoading.value = false;
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
