<template>
    <div class="flex flex-col border-2 shutter-border-color my-3 rounded-md p-2 shutter-background-mute">

        <!-- Gallery title, description and date -->
        <div class=" mr-36 pt-2 pl-4 font-bold text-2xl break-words">{{ props.gallery.title }}</div>
        <div class="p-4 absolute top-0 right-0 text-xl">{{ props.gallery.created_date }}</div>

        <div class="pl-4 break-words">{{ props.gallery.description }}</div>

        <!-- Publications scroll -->
        <div class="flex flex-row items-center relative">

            <!-- Left Icon -->
            <button
                class="h-72 flex items-center rounded-r-md z-10 absolute left-0 shutter-background-mute-transparent shutter-border-color border-r-2 border-y-2"
                v-if="!isAtStart && props.gallery.publications.length > 0" @click="animateListToTheLeft">
                <LeftChevron class="h-8 shutter-color-border" />
            </button>


            <!-- Publications -->
            <div class="scrollmenu grow w-full p-2" v-dragscroll.x ref="publicationListContainer">
                <div class="w-80 h-80 px-2" v-if="props.gallery.publications.length === 0">
                    <div
                        class="border-2 w-full h-full rounded-md shutter-border-color flex flex-col justify-center items-center shutter-background-color">
                        <span class="text-xl">No publications in this gallery</span>
                        <CameraIcon class="w-40" />
                    </div>
                </div>

                <!-- No Publications -->
                <PublicationGalleryComponent v-for="publication in props.gallery.publications" id="publications"
                    :is-current-user="props.isCurrentUser" :publication="publication"
                    @open-publication-modal="emit('openPublicationModal', publication.publication_id)"
                    @delete-publication="deletePublicationFromGallery(publication)">
                </PublicationGalleryComponent>
            </div>

            <!-- Right Icon -->
            <button
                class="z-10 absolute right-0 shutter-background-mute-transparent border-l-2 border-y-2 shutter-border-color rounded-l-md h-72 flex items-center w-8"
                v-if="!isAtEnd && props.gallery.publications.length > 0" @click="animateListToTheRight">
                <RightChevron class="h-8 shutter-color-border" />
            </button>
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
import type { Gallery, SimplifiedPublication } from "@/api/type";
import { type PropType, ref, onMounted, onBeforeUnmount } from "vue";
import { useGalleryStore } from "@/stores/gallery";
import { useUserStore } from "@/stores/user";
import { getPublicationFromGalleryApi } from "@/api/gallery";



const publicationListContainer = ref();
const galleryStore = useGalleryStore();
const userStore = useUserStore();
const isAtEnd = ref(false);
const isAtStart = ref(true);
const isUpdating = ref(false);
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
    galleryStore.setGalleryIndex(props.gallery.gallery_id, 1);
    publicationListContainer.value.addEventListener('scroll', checkLoading);
    scrollInterval = setInterval(() => {
        checkScroll();
    }, 25);
})
onBeforeUnmount(() => {
    publicationListContainer.value.removeEventListener('scroll', checkLoading);
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
function checkLoading() {

    if ((publicationListContainer.value.offsetWidth + publicationListContainer.value.scrollLeft + 200) >= publicationListContainer.value.scrollWidth) {
        loadMorePublications();
    }
}
function checkScroll() {

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
async function deletePublicationFromGallery(publication: SimplifiedPublication) {
    await galleryStore.removePublicationFromGallery(props.gallery.gallery_id, publication);
}

async function deleteEntireGallery() {
    await galleryStore.deleteGallery(props.gallery.gallery_id)
}

async function loadMorePublications() {
    if (!isUpdating.value) {
        let index = galleryStore.getGalleryIndex(props.gallery.gallery_id)!;
        if (props.gallery.nb_publication / 12 < index) return;
        isUpdating.value = true;

        galleryStore.addIndexToGalleryIndex(props.gallery.gallery_id, index + 1);
        isUpdating.value = true;
        const res = await getPublicationFromGalleryApi(props.gallery.gallery_id, index + 1, userStore.authKey);
        const data = await res.json();
        for (let i = 0; i < data.length; i++) {
            galleryStore.addPublicationToGalleryMap(props.gallery.gallery_id, data[i])
        }
        isUpdating.value = false;
    }
}
</script>