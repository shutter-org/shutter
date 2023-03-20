<template>
  <div class="fixed inset-0 z-50 flex justify-center overflow-y-scroll">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10" @click="emit('close')"></div>
    <RingLoader v-if="isLoading" color="#465A82" size="60px" class="m-auto translate-x-[126px] PRO:translate-x-0 " />
    <div v-else class="relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4">
      <publication-component class="" @delete-pub="deletePub" @search-tag="searchTag" @add-to-gallery="addToGallery"
        :publication="shownPublication" :is-current-user="isCurrentUser"></publication-component>
      <div class="h-10"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PublicationComponent from "@/components/PublicationComponent.vue";
import RingLoader from "vue-spinner/src/RingLoader.vue"
import { ref } from "vue";
import { deletePublication } from "@/api/publication";
import { useUserStore } from '@/stores/user'
import { usePublicationStore } from "@/stores/publication";

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
const isLoading = ref(true);

loadPublication();

async function loadPublication() {
  const token = publicationStore.getShownPublication(props.publicationId);
  if (token !== undefined) {
    shownPublication.value = token;
    isLoading.value = false;
    await publicationStore.loadShownPublication(props.publicationId);
  }
  else {
    shownPublication.value = await publicationStore.loadShownPublication(props.publicationId);
    isLoading.value = false;
  }
};
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
};
</script>

<style scoped></style>
