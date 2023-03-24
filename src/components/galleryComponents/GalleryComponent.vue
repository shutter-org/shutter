<template>
    <div class="flex flex-col border-2 shutter-border-color my-3 rounded-md p-2 shutter-background-mute">

        <!-- Gallery title, description and date -->
        <div class="flex flex-row justify-between p-2">
            <div class="font-bold text-2xl break-words">{{ props.gallery.title }}</div>
            <div class="text-xl">{{ props.gallery.created_date }}</div>
        </div>
        <div class="pl-2 break-words">{{ props.gallery.description }}</div>

        <!-- Gallery scroll -->
        <div class="scrollmenu" v-dragscroll>
            <div class="p-2">
                <PublicationGalleryComponent v-for="publication in props.gallery.publications"
                    :is-current-user="props.isCurrentUser" :publication="publication"
                    @open-publication-modal="emit('openPublicationModal', publication.publication_id)"
                    @delete-publication="deletePublicationFromGallery(publication.publication_id)">
                </PublicationGalleryComponent>
                <div class="w-80  h-80 px-2" v-if="props.gallery.publications.length === 0">
                    <div
                        class="border-2 w-full h-full rounded-md shutter-border-color flex flex-col justify-center items-center shutter-background-color">
                        <span class="text-xl">No publications in this gallery</span>
                        <CameraIcon class="w-40" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Gallery rating, modify and delete -->
        <div class="flex flex-row justify-between p-2">
            <RatingInterface @vote-up="galleryStore.voteUpGallery(props.gallery)"
                @vote-down="galleryStore.voteDownGallery(props.gallery)" :total_rate="props.gallery.rating"
                :user_rate="props.gallery.user_rating">
            </RatingInterface>
            <div class="flex flex-row gap-2">
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
import CameraIcon from "../icons/CameraIcon.vue";
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
    openGalleryModificationModal: (gallery: Gallery) => {
        return !!gallery;
    }
});

async function deletePublicationFromGallery(publication_id: string) {
    await galleryStore.removePublicationFromGallery(props.gallery.gallery_id, publication_id);
}

async function deleteEntireGallery() {
    await galleryStore.deleteGallery(props.gallery.gallery_id)
}
</script>
<style>
div.scrollmenu {
    overflow: auto;
    white-space: nowrap;
}
</style>