<template>
  <div class="fixed inset-0 z-50 flex justify-center overflow-y-scroll">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10" @click="emit('close')"></div>
    <div class="relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4">
      <publication-component class="" @vote-up-pub="emit('voteUpPub')" @vote-down-pub="emit('voteDownPub')"
        @vote-up-comment="emit('voteUpComment', $event)" @vote-down-comment="emit('voteDownComment', $event)"
        @search-tag="emit('searchTag', $event)" @add-to-gallery="emit('addToGallery')"
        @add-comment="(publicationId: string, message: string) => emit('addComment', message)"
        :publication="props.publication"></publication-component>
      <div class="h-10"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PublicationComponent from "@/components/PublicationComponent.vue";
import type { Publication } from "@/api/type";
import type { PropType } from "vue";

const props = defineProps({
  publication: {
    type: Object as PropType<Publication>,
    required: true,
  },
});

const emit = defineEmits({
  close: () => {
    return true;
  },
  voteUpPub: () => {
    return true;
  },
  voteDownPub: () => {
    return true;
  },
  addToGallery: () => {
    return true;
  },
  searchTag: (tag: string) => {
    return !!tag;
  },
  voteUpComment: (commentId: string) => {
    return !!commentId;
  },
  voteDownComment: (commentId: string) => {
    return !!commentId;
  },
  addComment: (message: string) => {
    return !!message;
  },
});
</script>

<style scoped></style>
