<template>
    <div class="fixed inset-0 z-50 flex justify-center items-center">
        <!-- Gray backgrounds -->
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10" @click="emit('close')">
        </div>
        <div
            class="shutter-modal-color relative mx-auto p-5 w-[640px] PRO:max-w-[640] shadow-lg rounded-lg PRO:mx-4 translate-x-[126px] PRO:translate-x-0 flex flex-col justify-center items-center">

            <!-- private/public -->
            <div
                class="mb-5 w-full rounded-md h-12 border-2 shutter-background-color shutter-border-color pl-4 self-center flex items-center justify-center">
                <input type="checkbox" class=" outline-none w-7 h-7 bg-gray-100 border-gray-300 rounded-lg"
                    :checked="public_bool" @click="clickOnCheckbox">
                <span class="ml-3 mr-5">Public</span>
                <input type="checkbox" class="outline-none w-7 h-7 bg-gray-100 border-gray-300 rounded-lg"
                    :checked="private_bool" @click="clickOnCheckbox">
                <span class="mx-3">Private</span>
            </div>

            <!-- Title -->
            <div
                class="mb-5 w-full rounded-md h-12 border-2 shutter-background-color shutter-border-color pl-4 self-center flex items-center">
                <input class="z-2 outline-none shutter-background-color box-border h-11 w-full rounded-md" v-focus
                    maxlength="50" v-model="title" placeholder="Title..." />
            </div>

            <!-- Description -->
            <textarea
                class="inputable shadow-none resize-none shutter-border-color shutter-background-color w-full max-h-48 mb-5 p-2 border-2 rounded-lg"
                placeholder="Description..." maxlength="200" v-model="description"></textarea>

            <!-- Error message -->
            <p class="text-lg inline h-7 mb-1 items-center text-red-500">{{ errorMessage }}</p>


            <!-- Save button -->
            <button class="modalButton text-xl p-2 rounded-lg pr-10 pl-10" @click="createGallery">
                Save
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGalleryStore } from '@/stores/gallery';
import type { GalleryParameters } from '@/api/type';

const errorMessage = ref('');
const galleryStore = useGalleryStore();
const title = ref('')
const description = ref('')
const private_bool = ref(false)
const public_bool = ref(true)

function clickOnCheckbox() {
    if (private_bool.value == true) {
        private_bool.value = false
        public_bool.value = true
    } else {
        private_bool.value = true
        public_bool.value = false
    }
}
watch([title, () => description.value], ([newTitle, newDesc]) => {
    if (!newTitle && !newDesc) {
        errorMessage.value = 'Title and Description are required';
    } else if (!newTitle) {
        errorMessage.value = 'Title is required';
    } else if (!newDesc) {
        errorMessage.value = 'Description is required';
    } else {
        errorMessage.value = '';
    }
})

async function createGallery() {
    if (errorMessage.value) return
    const galleryParameters: GalleryParameters = {
        title: title.value,
        description: description.value,
        private: private_bool.value
    }
    const res = await galleryStore.createGallery(galleryParameters)
    if (res.status != 201) {
        const json = await res.json()
        errorMessage.value = json.Error;
        return
    }
    emit('close')
}
const emit = defineEmits(["close", "createGallery"]);
const vFocus = {
    mounted: (el: { focus: () => any; }) => el.focus(),
};
</script>