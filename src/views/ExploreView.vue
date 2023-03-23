<template>
  <div
    class="shutter-background-mute min-h-screen PRO:min-h-[calc(100vh-160px)] w-full p-10 max-w-7xl ml-auto mr-auto flex flex-col gap-8">
    <div v-if="!isLoading"
      class="shutter-border-color shutter-background-color w-full flex flex-col gap-2 items-center rounded-lg p-4 border-2 h-full">

      <!-- Command to search tags -->
      <span class="flex-1 ml-3 text-LG">
        <kbd class="hx_kbd border-2 shutter-border-mute">
          <span v-if="isWindows">Ctrl K</span>
          <span v-else>&#x2318; K</span>
        </kbd> to search for tags
      </span>

      <!-- Tag name, number of publications, recent posts -->
      <span class="flex-1 ml-3 text-4xl" v-if="!isTagNameEmpty">#{{ route.params.tag }}</span>
      <span class="flex-1 ml-3 text-2xl" v-if="!isTagNameEmpty">{{ numberOfPublications }} posts</span>
      <span class="flex-1 ml-3 text-4xl" v-if="isTagNameEmpty">Recent posts</span>

      <!-- List of every publications -->
      <div class="w-full h-full grid grid-cols-3 PRO:grid-cols-2 gap-6 PRO:gap-4 p-4 pt-10">
        <button v-for="publication in shownPublications" @click="openPublicationModal(publication.publication_id)">
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

    <!-- Loading animation -->
    <SyncLoader v-if="isLoading" color="#465A82" size="24px" class="m-auto" />
  </div>
</template>
<script setup lang="ts">
import PublicationModal from "@/components/publicationsComponents/PublicationModal.vue";
import SyncLoader from "vue-spinner/src/SyncLoader.vue"
import SadIcon from "@/components/icons/SadIcon.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { getPublicationByTag } from "@/api/publication";
import { useUserStore } from "@/stores/user";
import type { Publication } from "@/api/type";
import { useRoute } from "vue-router";

const userStore = useUserStore();
const route = useRoute();
const isPublicationModalShown = ref(false);
const shownPublications = ref<Publication[]>([]);
const numberOfPublications = ref(0);
const pageIndex = ref(1);
const shownPublicationId = ref();
const shownPublication = ref();
const loggedUsername = userStore.username;
const isTagNameEmpty = ref(true);
const isTagPublicationsEmpty = ref(false);
const isLoading = ref(true);
const isWindows = navigator.userAgent.indexOf("Win") > -1;


onMounted(() => {
  document.addEventListener('scroll', handleScroll);
})
onBeforeUnmount(() => {
  document.removeEventListener('scroll', handleScroll);
})


searchPublicationByTag(route.params.tag.toString(), pageIndex.value);
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
    shownPublications.value = data.publications;
    numberOfPublications.value = data.nb_publication;
    isLoading.value = false;
  }
}

const openPublicationModal = (publicationId: string) => {
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
  shownPublications.value = shownPublications.value.filter((publication: Publication) => {
    return publication.publication_id !== publicationId;
  });
}

async function loadMorePublications() {
  if (numberOfPublications.value / 12 < pageIndex.value) return;
  pageIndex.value++;
  const res = await getPublicationByTag(pageIndex.value, route.params.tag.toString(), userStore.authKey);
  if (res.status !== 200) {
    return;
  } else {
    const data = await res.json()
    shownPublications.value = shownPublications.value.concat(data.publications);
  }
}
const handleScroll = () => {
  let windowHeight = window.innerHeight;
  let documentHeight = document.body.clientHeight;
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  let scrollHeight = documentHeight - windowHeight;

  if (scrollTop >= scrollHeight - 300) {
    loadMorePublications();
  }
}


</script>
