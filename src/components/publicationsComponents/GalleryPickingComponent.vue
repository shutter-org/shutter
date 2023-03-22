<template>
    <div class="fixed inset-0 z-50 flex justify-center items-center">
        <div v-if="!isLoading"
            class="shutter-modal-color relative mx-auto p-5 w-[640px] PRO:max-w-[640] shadow-lg rounded-lg PRO:mx-4 translate-x-[126px] PRO:translate-x-0 flex flex-col justify-center items-center">
            <!-- List of galleries -->
            <div v-for="gallery in shownGalleries" class="flex flex-row justify-center items-center">
                <input type="checkbox" class=" outline-none w-7 h-7 bg-gray-100 border-gray-300 rounded-lg" @click="clicked"
                    v-model="gallery.checked">
                <div class="flex flex-col">

                    <label class="ml-2 text-xl font-medium ">{{ gallery.title }}</label>
                    <label class="ml-2 text-md">{{ gallery.publications.length }} posts</label>
                </div>
            </div>
            <!-- Save button -->
            <button class="shutter-hover-color text-xl p-2 rounded-lg pr-10 pl-10" @click="emit('save')">
                Save
            </button>
        </div>
        <RingLoader v-if="isLoading" color="#465A82" size="60px" class="m-auto translate-x-[126px] PRO:translate-x-0" />

    </div>
</template>
<script setup lang="ts">
import type { SimplifiedPublication } from "@/api/type";
import { ref, type PropType } from "vue";
import RingLoader from "vue-spinner/src/RingLoader.vue"
import { useGalleryStore } from "@/stores/gallery";

const isLoading = ref(true);
const shownGalleries = ref();
const galleryStore = useGalleryStore();


loadSimplifiedGalleries().then(() => {
    isLoading.value = false;
});

async function loadSimplifiedGalleries() {
    shownGalleries.value = await galleryStore.getSimplifiedGalleries();
    for (let i = 0; i < shownGalleries.value.length; i++) {
        for (let j = 0; j < shownGalleries.value[i].publications.length; j++) {
            if (shownGalleries.value[i].publications[j].publication_id === props.publication.publication_id) {
                shownGalleries.value[i].checked = true;
                console.log('checked')
                break;
            }
        }
    }
}
function clicked() {
    console.log(shownGalleries.value)
}



const props = defineProps({
    publication: {
        type: Object as PropType<SimplifiedPublication>,
        required: true,
    },
});
const emit = defineEmits({
    save: () => {
        return
    },
});

</script>
<style scoped>
input[type="checkbox"]:focus {
    outline: none;
    box-shadow: none;
}
</style>


