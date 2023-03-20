<template>
    <div class="scrollmenu" v-dragscroll>
        <button v-for="publication in props.gallery.publications" class="w-80 px-1"
            @click="emit('openPublicationModal', publication.publication_id)">
            <ImgLoader class="w-full object-cover aspect-square rounded-lg" :src="publication.picture" />
        </button>
    </div>
</template>
<script setup lang="ts">
import ImgLoader from "./ImgLoader.vue";
import type { Gallery } from "@/api/type";
import type { PropType } from "vue";


const props = defineProps({
    gallery: {
        type: Object as PropType<Gallery>,
        required: true
    }
})
const emit = defineEmits({
    openPublicationModal: (publicationId: string) => {
        return !!publicationId;
    }
});
</script>
<style>
div.scrollmenu {
    overflow: auto;
    white-space: nowrap;
}
</style>