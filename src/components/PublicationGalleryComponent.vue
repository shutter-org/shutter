<template>
    <button class="w-80 px-2" @mouseover="hover = true" @mouseleave="hover = false">
        <ImgLoader class="w-full object-cover aspect-square rounded-lg" :src="props.publication.picture" />
        <DeleteComponent v-if="props.isCurrentUser && hover" class="absolute top-0 right-0 px-2"
            @delete="emit('deletePublication', props.publication.publication_id)" />
        <button v-if="hover"
            class="absolute top-2/4 left-2/4 open-button w-24 h-24 bg-gray-900 bg-opacity-80 rounded-lg text-lg"
            @click="emit('openPublicationModal', props.publication.publication_id)"> open </button>
    </button>
</template>

<script setup lang="ts">
import type { SimplifiedPublication } from '@/api/type';
import { defineProps, type PropType, ref } from 'vue';
import ImgLoader from "./ImgLoader.vue";
import DeleteComponent from "./subComponents/DeleteComponent.vue";
import { useGalleryStore } from '@/stores/gallery';

const hover = ref(false);
const props = defineProps({
    publication: {
        type: Object as PropType<SimplifiedPublication>,
        required: true
    },
    isCurrentUser: {
        type: Boolean,
        required: true
    }
})
const emit = defineEmits({
    openPublicationModal: (publicationId: string) => {
        return !!publicationId;
    },
    deletePublication: (publication_id: string) => {
        return !!publication_id;
    }
});
</script>
