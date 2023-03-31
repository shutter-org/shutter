<template>
    <button class="w-80 px-2 mt-2" @mouseover="hover = true" @mouseleave="hover = false">
        <ImgLoader class="w-full object-cover aspect-square rounded-lg" :src="props.publication.picture" />

        <!-- Button to open publication modal -->
        <DeleteComponent v-if="props.isCurrentUser && hover" class="absolute top-2 right-4 rounded-md text-see-through"
            @delete="emit('deletePublication')" />

        <!-- Button to open publication modal -->
        <button v-if="hover"
            class="absolute top-2/4 left-2/4 open-button w-24 h-24 rounded-lg text-lg font-bold text-see-through"
            @click="emit('openPublicationModal', props.publication.publication_id)"> open </button>
    </button>
</template>

<script setup lang="ts">
import ImgLoader from "../ImgLoader.vue";
import DeleteComponent from "../subComponents/DeleteComponent.vue";
import type { SimplifiedPublication } from '@/api/type';
import { type PropType, ref } from 'vue';

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
    deletePublication: () => {
        return
    }
});
</script>
