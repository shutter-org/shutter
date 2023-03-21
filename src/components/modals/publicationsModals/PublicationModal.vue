<template>
  <div class="fixed inset-0 z-50 flex flex-col gap-8 overflow-y-scroll pt-10">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10" @click="emit('close')"></div>

    <!-- Spinners showing status (updating, loading) -->
    <SkewLoader v-if="isUpdating" color="#465A82" size="10px"
      class="m-full h-8 translate-x-[126px] PRO:translate-x-0 absolute top-2 left-1/2" />
    <RingLoader v-if="isLoading" color="#465A82" size="60px" class="m-auto translate-x-[126px] PRO:translate-x-0" />

    <!-- Publication -->
    <div v-else-if="!isShowingModifModal"
      class="relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4">
      <publication-component @delete-pub="deletePub" @search-tag="searchTag" @add-to-gallery="addToGallery"
        @modify="isShowingModifModal = true" :publication="shownPublication"
        :is-current-user="isCurrentUser"></publication-component>
    </div>

    <PublicationModificationModal v-else :publication="shownPublication" @save="save">
    </PublicationModificationModal>
  </div>
</template>

<script setup lang="ts">
import PublicationComponent from "@/components/publicationsComponents/PublicationComponent.vue";
import PublicationModificationModal from "@/components/publicationsComponents/PublicationModificationComponent.vue"
import RingLoader from "vue-spinner/src/RingLoader.vue"
import SkewLoader from "vue-spinner/src/SkewLoader.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { deletePublication } from "@/api/publication";
import { useUserStore } from '@/stores/user'
import { usePublicationStore } from "@/stores/publication";


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
const shownPublication = ref();
const isShowingModifModal = ref(false);
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
async function save(desc: string, tags: string[]) {
  isUpdating.value = true;
  isShowingModifModal.value = false;
  await publicationStore.modifyShownPublication(shownPublication.value.publication_id, desc, tags);
  isUpdating.value = false;
}
const deletePub = () => {
  deletePublication(shownPublication.value.publication_id, userStore.authKey);
  emit("delete", shownPublication.value.publication_id);
  emit("close");
}
const searchTag = (tag: string) => {
  console.log("searching tag : " + tag);
};
const addToGallery = () => {
  console.log("add publication " + shownPublication.value.publication_id + " to gallery");
  //addPublicationToGallery("gallery_id", shownPublication.value.publication_id, userStore.authKey);
};
</script>

<style scoped></style>
