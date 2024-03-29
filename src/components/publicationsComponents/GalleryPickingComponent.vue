<template>
    <div class="fixed inset-0 z-50 flex justify-center items-center">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full" @click="emit('save')"></div>
        <div v-if="!isLoading"
            class="shutter-modal-color relative mx-auto px-16 pb-16 w-[500px] PRO:max-w-[500] shadow-lg rounded-lg PRO:mx-4 translate-x-[126px] PRO:translate-x-0 flex flex-col justify-center items-center">

            <SkewLoader v-if="isUpdating" color="#465A82" size="10px" class="m-full h-8" />
            <div v-if="!isUpdating" class="m-full h-8"></div>
            <!-- No galleries -->
            <span class="ml-3 text-2xl mb-8"
                v-if="galleryStore.getShownPickingGalleries(props.publication.publication_id).length === 0">
                You have no galleries</span>

            <p class="text-2xl p-2 font-bold">Add to galleries</p>

            <UpvoteIcon v-if="!isAtStart" class="w-full h-8 border-b-2 shutter-border-color" />
            <div class="w-full h-8" v-if="isAtStart"></div>

            <!-- List of galleries second try -->
            <div class="p-4 overflow-y-auto max-h-80 flex flex-col w-full gap-2" id="galleriesContainer"
                @scroll="handleScroll">
                <div v-for="gallery in galleryStore.getShownPickingGalleries(props.publication.publication_id)"
                    class="w-full">
                    <div class="flex flex-row items-center gap-5 w-full">
                        <input type="checkbox" class="outline-none w-7 h-7 bg-gray-100 border-gray-300 rounded-lg mr-2"
                            v-model="gallery.checked">
                        <div class="flex flex-col w-[calc(100%-3rem)]">
                            <p class="text-xl font-medium inline overflow-ellipsis overflow-x-clip">{{ gallery.title }}</p>
                            <p class="text-md">{{ gallery.publications.length }} posts</p>
                        </div>
                    </div>
                </div>
            </div>
            <DownvoteIcon v-if="!isAtEnd" class="w-full h-8 border-t-2 shutter-border-color" />
            <div class="w-full h-8" v-if="isAtEnd"></div>


            <!-- Save button -->
            <button class="modalButton text-xl p-2 rounded-lg pr-10 pl-10" @click="updateGalleries">
                Save
            </button>
        </div>
        <RingLoader v-if="isLoading" color="#465A82" size="60px" class="m-auto translate-x-[126px] PRO:translate-x-0" />
    </div>
</template>
<script setup lang="ts">
import RingLoader from "vue-spinner/src/RingLoader.vue"
import SkewLoader from "vue-spinner/src/SkewLoader.vue"
import DownvoteIcon from "../icons/rate/DownvoteIcon.vue";
import UpvoteIcon from "../icons/rate/UpvoteIcon.vue";
import type { SimplifiedPublication } from "@/api/type";
import { ref, type PropType, onMounted, onUpdated } from "vue";
import { useGalleryStore } from "@/stores/gallery";

const isAtEnd = ref(false);
const isAtStart = ref(true);
const galleryStore = useGalleryStore();
const isLoading = ref(true);
const isUpdating = ref(true);
const copyOfShownGalleries = ref();

const props = defineProps({
    publication: {
        type: Object as PropType<SimplifiedPublication>,
        required: true,
    },
});

const emit = defineEmits(['save']);

const handleScroll = () => {
    let container = document.getElementById("galleriesContainer");

    if (container !== null) {
        if ((container.offsetHeight + container.scrollTop) >= container.scrollHeight) {
            isAtEnd.value = true;
        }
        else {
            isAtEnd.value = false;
        }

        if (container.scrollTop === 0) {
            isAtStart.value = true;
        }
        else {
            isAtStart.value = false;
        }
    }
}

onUpdated(() => {
    handleScroll();
});

onMounted(() => {
    const galleryList = galleryStore.getShownPickingGalleries(props.publication.publication_id);
    if (galleryList !== undefined) {
        if (galleryStore.getShownPickingGalleries(props.publication.publication_id).length !== 0) {
            isLoading.value = false;
        } else {
            isLoading.value = true;
            isUpdating.value = false;
        }
    }
    galleryStore.loadShownPickingGalleries(props.publication.publication_id).then(() => {
        isLoading.value = false;
        isUpdating.value = false;
        copyOfShownGalleries.value = JSON.parse(JSON.stringify(galleryStore.getShownPickingGalleries(props.publication.publication_id)));
    });

});

async function updateGalleries() {
    if (isUpdating.value === true) return;
    isLoading.value = true;
    let shownPickingGalleries = galleryStore.getShownPickingGalleries(props.publication.publication_id);
    for (let i = 0; i < copyOfShownGalleries.value.length; i++) {
        if (copyOfShownGalleries.value[i].checked !== shownPickingGalleries[i].checked) {
            if (shownPickingGalleries[i].checked) {
                const res = await galleryStore.addPublicationToGallery(shownPickingGalleries[i].gallery_id, props.publication);
                if (res === true) {
                    galleryStore.checkGallery(props.publication.publication_id, shownPickingGalleries[i].gallery_id);
                }
            } else {
                const res = await galleryStore.removePublicationFromGallery(shownPickingGalleries[i].gallery_id, props.publication);
                if (res === true) {
                    galleryStore.unCheckGallery(props.publication.publication_id, shownPickingGalleries[i].gallery_id);
                }
            }
        }
    }
    emit('save');
}
</script>


