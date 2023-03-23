<template>
  <div class="fixed inset-0 z-50 flex flex-col gap-8 overflow-y-scroll py-10 items-center">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10" @click="emit('close')"></div>

    <!-- Spinners showing status (updating, loading) -->
    <SkewLoader v-if="isUpdating" color="#465A82" size="10px"
      class="m-full h-8 translate-x-[126px] PRO:translate-x-0 absolute top-2 left-1/2" />
    <RingLoader v-if="isLoading" color="#465A82" size="60px" class="m-auto translate-x-[126px] PRO:translate-x-0" />

    <!-- Publication -->
    <div v-else-if="!isShowingModifModal && !isShowingGalleryPickingModal"
      class="relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4">
      <publication-component @delete-pub="deletePub" :is-current-user="isCurrentUser" :publication="shownPublication"
        @add-to-gallery="isShowingGalleryPickingModal = true" @modify="isShowingModifModal = true">
      </publication-component>
    </div>

    <!-- Publication Modification -->
    <PublicationModification v-else-if="isShowingModifModal" :publication="shownPublication" @save="saveModification" />
    <!-- Gallery Picking -->
    <GalleryPicking v-else-if="isShowingGalleryPickingModal" @save="saveGalleryPicking" :publication="shownPublication" />
  </div>
</template>

<script setup lang="ts">
import PublicationComponent from "@/components/publicationsComponents/PublicationComponent.vue";
import PublicationModification from "@/components/publicationsComponents/PublicationModificationComponent.vue"
import GalleryPicking from "@/components/publicationsComponents/GalleryPickingComponent.vue";
import RingLoader from "vue-spinner/src/RingLoader.vue"
import SkewLoader from "vue-spinner/src/SkewLoader.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { deletePublication } from "@/api/publication";
import { useUserStore } from '@/stores/user'
import { usePublicationStore } from "@/stores/publication";
import { useGalleryStore } from "@/stores/gallery";


onMounted(() => {
  document.addEventListener("keydown", onKeyDownEscape);
});
onBeforeUnmount(() => {
  document.removeEventListener("keydown", onKeyDownEscape);
});

function onKeyDownEscape(e: KeyboardEvent) {
  if (e.key === "Escape") {
    emit("close");
  }
}
const props = defineProps({
  publicationId: {
    type: String,
    required: true,
  },
  isCurrentUser: Boolean
});

const emit = defineEmits({
  close: () => {
    return true;
  },
  delete: (publicationId: string) => {
    return !!publicationId;
  }
});

const userStore = useUserStore();
const publicationStore = usePublicationStore();
const galleryStore = useGalleryStore();
const shownPublication = ref();
const isShowingModifModal = ref(false);
const isShowingGalleryPickingModal = ref(false);
const isLoading = ref(true);
const isUpdating = ref(false);

loadPublication();

async function loadPublication() {
  const token = publicationStore.getShownPublication(props.publicationId);
  if (token !== undefined) {
    shownPublication.value = token;
    isLoading.value = false;
    isUpdating.value = true;
  }
  shownPublication.value = await publicationStore.loadShownPublication(props.publicationId);
  isLoading.value = false;
  isUpdating.value = false
};
async function saveModification(desc: string, tags: string[]) {
  isUpdating.value = true;
  isShowingModifModal.value = false;
  await publicationStore.modifyShownPublication(shownPublication.value.publication_id, desc, tags);
  isUpdating.value = false;
}
async function saveGalleryPicking() {
  isUpdating.value = true;
  isShowingGalleryPickingModal.value = false;
  //call api
  isUpdating.value = false;
}
const deletePub = () => {
  deletePublication(shownPublication.value.publication_id, userStore.authKey);
  galleryStore.removePublicationFromGallery(shownPublication.value.publication_id);
  emit("delete", shownPublication.value.publication_id);
  emit("close");
}
</script>

<style scoped></style>
