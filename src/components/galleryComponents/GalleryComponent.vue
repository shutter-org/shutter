<template>
    <div class="flex flex-col border-2 shutter-border-color my-3 rounded-md py-2">
        <div class="flex flex-row justify-between">
            <div class="font-bold text-2xl pl-2 py-1">{{ props.gallery.title }}</div>
            <div class="text-xl pr-2 py-1">{{ props.gallery.created_date }}</div>
        </div>
        <div class="pl-2">{{ props.gallery.description }}</div>
        <div class="scrollmenu" v-dragscroll>
            <PublicationGalleryComponent v-for="publication in props.gallery.publications"
                :is-current-user="props.isCurrentUser" :publication="publication"
                @open-publication-modal="emit('openPublicationModal', publication.publication_id)"
                @delete-publication="emit('deletePublicationFromGallery', props.gallery.gallery_id, publication.publication_id)">
            </PublicationGalleryComponent>
            <div class="w-80  h-80 px-2" v-if="props.gallery.publications.length === 0">
                <div
                    class="border-2 w-full h-full rounded-md shutter-border-color flex flex-col justify-center items-center shutter-background-color">
                    <span class="text-xl">No publications in this gallery</span>
                    <CameraIcon class="w-40" />
                </div>
            </div>
        </div>
        <div class="flex flex-row justify-between px-2">
            <RatingInterface @vote-up="galleryStore.voteUpGallery(props.gallery)"
                @vote-down="galleryStore.voteDownGallery(props.gallery)" :total_rate="props.gallery.rating"
                :user_rate="props.gallery.user_rating">
            </RatingInterface>
            <div class="flex flex-row pr-2">
                <button v-if="props.isCurrentUser">
                    <ModifyIcon @click="emit('openGalleryModificationModal', props.gallery)"></ModifyIcon>
                </button>
                <DeleteComponent v-if="props.isCurrentUser" @delete="deleteEntireGallery">
                </DeleteComponent>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { Gallery } from "@/api/type";
import type { PropType } from "vue";
import ModifyIcon from "@/components/icons/modifyIcon.vue";
import DeleteComponent from "../subComponents/DeleteComponent.vue";
import RatingInterface from "../subComponents/RatingInterface.vue";
import PublicationGalleryComponent from "./PublicationGalleryComponent.vue";
import { useGalleryStore } from "@/stores/gallery";
import CameraIcon from "../icons/CameraIcon.vue";



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
    },
    openGalleryModificationModal: (gallery: Gallery) => {
        return !!gallery;
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
</style>