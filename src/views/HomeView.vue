<template>
  <!-- Infinite scroll loading post as scrolling -->
  <div id="publicationsContainer" @scroll="handleScroll" class="h-screen PRO:h-[calc(100vh-160px)] overflow-y-scroll">

    <div class="shutter-background-mute max-w-7xl w-full mx-auto p-10 flex flex-col gap-8 ">
      <!-- Spinner showing status (updating, loading home page) -->
      <SkewLoader v-if="isUpdating" color="#465A82" size="10px" class="m-full h-8 absolute top-2 left-1/2" />
      <SyncLoader v-if="isLoading" color="#465A82" size="24px" class="m-auto" />

      <!-- Posts display -->
      <publication class="max-w-2xl w-full mx-auto" v-else-if="publications.length > 0" @add-to-gallery="addToGallery"
        v-for="pub in publications" :publication="pub" :key="pub.publication_id"></publication>

      <!-- Empty home (if no post) -->
      <div v-else
        class="flex flex-col m-auto items-center p-10 rounded-lg border-2 shutter-border-color shutter-background-color">
        <EmptyIcon class="w-40 h-40"></EmptyIcon>
        <p class="text-3xl">It's empty here...</p>
      </div>

      <!-- Spinner showing loading more post status -->
      <SkewLoader v-if="isBusy" color="#465A82" size="10px" class="m-full h-8" />
      <GalleryPicking v-if="isShowingGalleryPickingModal" @save="saveGalleryPicking" :publication="shownPublication" />

    </div>
  </div>
</template>

<script setup lang="ts">
import GalleryPicking from "@/components/publicationsComponents/GalleryPickingComponent.vue";
import Publication from "@/components/publicationsComponents/PublicationComponent.vue";
import SyncLoader from "vue-spinner/src/SyncLoader.vue"
import SkewLoader from "vue-spinner/src/SkewLoader.vue";
import EmptyIcon from "@/components/icons/EmptyIcon.vue";
import { ref } from "vue";
import { usePublicationStore } from "@/stores/publication";
import type { Publication as Pub, SimplifiedPublication } from "@/api/type";


const publicationStore = usePublicationStore();
const isShowingGalleryPickingModal = ref(false);
const publications = ref([] as Pub[]);
const nextPage = ref(2);
const nb_publications = ref(0);
const isBusy = ref(false);
const isLoading = ref(true);
const isUpdating = ref(false);
const shownPublication = ref({} as SimplifiedPublication);

loadPublications();

function addToGallery(publication: SimplifiedPublication) {
  isShowingGalleryPickingModal.value = true
  shownPublication.value = publication;
}
async function loadPublications() {
  if (publicationStore.getHomePublications() !== undefined) {
    publications.value = publicationStore.getHomePublications();
    isLoading.value = false;
    isUpdating.value = true;
  }
  nb_publications.value = await publicationStore.loadHomePublications();
  publications.value = publicationStore.getHomePublications();
  isLoading.value = false;
  isUpdating.value = false;
};
async function loadMorePublications() {
  if (!isBusy.value) {
    isBusy.value = true;
    if (publications.value.length < nb_publications.value) {
      console.log("loading more posts")
      const token = await publicationStore.loadMorePublications(nextPage.value);
      publications.value = publicationStore.getHomePublications();
      nextPage.value += 1;
    }
    isBusy.value = false;
  }
}
async function saveGalleryPicking() {
  isUpdating.value = true;
  isShowingGalleryPickingModal.value = false;
  //call api
  isUpdating.value = false;
}

const handleScroll = () => {
  let container = document.getElementById("publicationsContainer")!;
  if ((container.offsetHeight + container.scrollTop + 500) >= container.scrollHeight) {
    loadMorePublications();
  }
}
</script>

