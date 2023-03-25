<template>
    <div class="fixed inset-0 z-50 flex justify-center items-center">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full" @click="emit('save')"></div>
        <div v-if="!isLoading"
            class="shutter-modal-color relative mx-auto pb-16 px-16 pt-8 PRO:max-w-[640] shadow-lg rounded-lg PRO:mx-4 translate-x-[126px] PRO:translate-x-0 flex flex-col justify-center items-center">

            <SkewLoader v-if="isUpdating" color="#465A82" size="10px" class="m-full h-8" />
            <div v-if="!isUpdating" class="m-full h-8"></div>
            <!-- No galleries -->
            <span class="ml-3 text-2xl mb-8"
                v-if="galleryStore.getShownPickingGalleries(props.publication.publication_id).length === 0">
                You have no galleries</span>


            <!-- List of galleries second try -->
            <div class="mb-4">
                <div v-for="gallery in galleryStore.getShownPickingGalleries(props.publication.publication_id)">
                    <div class="flex flex-row items-center gap-5">
                        <input type="checkbox" class="outline-none w-7 h-7 bg-gray-100 border-gray-300 rounded-lg mr-2"
                            v-model="gallery.checked">
                        <div class="flex flex-col">
                            <label class="ml-2 text-xl font-medium break-words">{{ gallery.title }}</label>
                            <label class="ml-2 text-md">{{ gallery.publications.length }} posts</label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Save button -->
            <button class="save-button shutter-hover-color text-xl p-2 rounded-lg pr-10 pl-10" @click="updateGalleries">
                Save
            </button>
        </div>
        <RingLoader v-if="isLoading" color="#465A82" size="60px" class="m-auto translate-x-[126px] PRO:translate-x-0" />
    </div>
</template>
<script setup lang="ts">
import RingLoader from "vue-spinner/src/RingLoader.vue"
import SkewLoader from "vue-spinner/src/SkewLoader.vue"
import type { Gallery, SimplifiedPublication } from "@/api/type";
import { ref, type PropType, onMounted } from "vue";
import { useGalleryStore } from "@/stores/gallery";


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
    isLoading.value = true;
    for (let i = 0; i < copyOfShownGalleries.value.length; i++) {
        if (copyOfShownGalleries.value[i].checked !== galleryStore.getShownPickingGalleries(props.publication.publication_id)[i].checked) {
            if (galleryStore.getShownPickingGalleries(props.publication.publication_id)[i].checked) {
                const gallery = galleryStore.getGalleryFromMap(galleryStore.getShownPickingGalleries(props.publication.publication_id)[i].gallery_id) as Gallery;
                const res = await galleryStore.addPublicationToGallery(gallery.gallery_id, props.publication.publication_id);
                if (res === true) {
                    galleryStore.checkGallery(props.publication.publication_id, gallery.gallery_id);
                }

            } else {
                const gallery = galleryStore.getGalleryFromMap(galleryStore.getShownPickingGalleries(props.publication.publication_id)[i].gallery_id) as Gallery;
                const res = await galleryStore.removePublicationFromGallery(gallery.gallery_id, props.publication.publication_id);
                if (res === true) {
                    galleryStore.unCheckGallery(props.publication.publication_id, gallery.gallery_id);
                }
            }
        }
    }
    emit('save');
}


</script>
<style scoped>
.save-button:hover {
    background-color: var(--color-border);
}

input[type="checkbox"]:focus {
    outline: none;
    box-shadow: none;
}
</style>


