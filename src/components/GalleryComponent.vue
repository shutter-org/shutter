<template>
    <div class="flex flex-col border-2 shutter-border-color my-3 rounded-md py-2">
        <div class="flex flex-row justify-between">
            <div class="font-bold text-2xl pl-2 py-1">{{ props.gallery.title }}</div>
            <div class="text-xl pr-2 py-1">{{ props.gallery.created_date }}</div>
        </div>
        <div class="pl-2">{{ props.gallery.description }} !!!description a repenser</div>
        <div class="scrollmenu" v-dragscroll>
            <PublicationGalleryComponent v-for="publication in props.gallery.publications"
                :is-current-user="props.isCurrentUser" :publication="publication"
                @open-publication-modal="emit('openPublicationModal', publication.publication_id)"
                @delete-publication="emit('deletePublicationFromGallery', props.gallery.gallery_id, publication.publication_id)">
            </PublicationGalleryComponent>
        </div>
        <div class="flex flex-row justify-between">
            <RatingInterface @vote-up="galleryStore.voteUpGallery(props.gallery)"
                @vote-down="galleryStore.voteDownGallery(props.gallery)" :total_rate="props.gallery.rating"
                :user_rate="props.gallery.user_rating">
            </RatingInterface>
            <div class="flex flex-row pr-2">
                <button v-if="props.isCurrentUser">
                    <ModifyIcon></ModifyIcon>
                </button>
                <DeleteComponent v-if="props.isCurrentUser" @delete="deleteEntireGallery">
                </DeleteComponent>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import ImgLoader from "./ImgLoader.vue";
import type { Gallery } from "@/api/type";
import type { PropType } from "vue";
import ModifyIcon from "@/components/icons/modifyIcon.vue";
import DeleteComponent from "./subComponents/DeleteComponent.vue";
import RatingInterface from "./subComponents/RatingInterface.vue";
import PublicationGalleryComponent from "./PublicationGalleryComponent.vue";
import { useGalleryStore } from "@/stores/gallery";


const galleryStore = useGalleryStore();
const props = defineProps({
    gallery: {
        type: Object as PropType<Gallery>,
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
    deleteGallery: (gallery_id: string) => {
        return !!gallery_id;
    },
    deletePublicationFromGallery: (gallery_id: string, publication_id: string) => {
        return {
            gallery_id,
            publication_id
        }
    }
});

async function deleteEntireGallery() {
    if (await galleryStore.deleteGallery(props.gallery)) {
        emit('deleteGallery', props.gallery.gallery_id);
    }
}
</script>
<style>
div.scrollmenu {
    overflow: auto;
    white-space: nowrap;
}

.open-button {
    transform: translate(-50%, -50%);
}
</style>