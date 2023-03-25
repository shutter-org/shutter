<template>
    <div class="flex flex-col border-2 shutter-border-color my-3 rounded-md p-2 shutter-background-mute">

        <!-- Gallery title, description and date -->
        <div class="flex flex-row justify-between p-2">
            <div class="font-bold text-2xl break-words">{{ props.gallery.title }}</div>
            <div class="text-xl">{{ props.gallery.created_date }}</div>
        </div>
        <div class="pl-2 break-words">{{ props.gallery.description }}</div>


        <!-- Publications scroll -->
        <div class="flex flex-row items-center relative">

            <!-- Left Icon -->
            <button
                class="h-72 flex items-center rounded-r-md z-10 absolute left-0 shutter-background-color shutter-border-color border-r-2"
                v-if="!isAtStart && props.gallery.publications.length > 0" @click="animateListToTheLeft">
                <LeftChevron class="h-8" />
            </button>


            <!-- Publications -->
            <div class="scrollmenu grow w-full p-2" v-dragscroll.x ref="publicationListContainer">
                <PublicationGalleryComponent v-for="publication in props.gallery.publications" id="publications"
                    :is-current-user="props.isCurrentUser" :publication="publication"
                    @open-publication-modal="emit('openPublicationModal', publication.publication_id)"
                    @delete-publication="deletePublicationFromGallery(publication.publication_id)">
                </PublicationGalleryComponent>
            </div>

            <!-- Right Icon -->
            <button
                class="z-10 absolute right-0 shutter-background-color border-l-2 shutter-border-color rounded-l-md h-72 flex items-center"
                v-if="!isAtEnd && props.gallery.publications.length > 0" @click="animateListToTheRight">
                <RightChevron class="h-8" />
            </button>

        </div>

        <!-- No Publications -->
        <div class="w-80 h-80 px-2" v-if="props.gallery.publications.length === 0">
            <div
                class="border-2 w-full h-full rounded-md shutter-border-color flex flex-col justify-center items-center shutter-background-color">
                <span class="text-xl">No publications in this gallery</span>
                <CameraIcon class="w-40" />
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
import ModifyIcon from "@/components/icons/modifyIcon.vue";
import DeleteComponent from "../subComponents/DeleteComponent.vue";
import RatingInterface from "../subComponents/RatingInterface.vue";
import PublicationGalleryComponent from "./PublicationGalleryComponent.vue";
import RightChevron from "@/components/icons/RightChevron.vue";
import LeftChevron from "@/components/icons/LeftChevron.vue";
import CameraIcon from "../icons/CameraIcon.vue";
import type { Gallery } from "@/api/type";
import { type PropType, ref, onMounted, onBeforeUnmount } from "vue";
import { useGalleryStore } from "@/stores/gallery";



const publicationListContainer = ref();
const galleryStore = useGalleryStore();
const isAtEnd = ref(false);
const isAtStart = ref(true);
let scrollInterval: number | null | undefined = null

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

onMounted(() => {
    scrollInterval = setInterval(() => {
        checkScroll();
    }, 25);
})
onBeforeUnmount(() => {
    clearInterval(scrollInterval!);
})

const emit = defineEmits({
    openPublicationModal: (publicationId: string) => {
        return !!publicationId;
    },
    openGalleryModificationModal: (gallery: Gallery) => {
        return !!gallery;
    }
});

function animateListToTheRight() {
    let scrollLeft = publicationListContainer.value.scrollLeft;
    let interval = setInterval(function () {
        scrollLeft += 10;
        publicationListContainer.value.scrollLeft = scrollLeft;
        if (scrollLeft >= publicationListContainer.value.scrollWidth - publicationListContainer.value.offsetWidth) {
            clearInterval(interval);
        }
    }, 10);
}
function animateListToTheLeft() {
    let scrollLeft = publicationListContainer.value.scrollLeft;
    let interval = setInterval(function () {
        scrollLeft -= 10;
        publicationListContainer.value.scrollLeft = scrollLeft;
        if (scrollLeft <= 0) {
            clearInterval(interval);
        }
    }, 10);
}
function checkScroll() {
    if ((publicationListContainer.value.offsetWidth + publicationListContainer.value.scrollLeft + 200) >= publicationListContainer.value.scrollWidth) {
        //loadMorePublications(props.gallery.gallery_id);
    }

    if ((publicationListContainer.value.offsetWidth + publicationListContainer.value.scrollLeft) >= publicationListContainer.value.scrollWidth) {
        isAtEnd.value = true;
    }
    else {
        isAtEnd.value = false;
    }

    if (publicationListContainer.value.scrollLeft === 0) {
        isAtStart.value = true;
    }
    else {
        isAtStart.value = false;
    }
}
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

.middle {
    position: fixed;
    top: 50%;
    left: 50%;

}
</style>