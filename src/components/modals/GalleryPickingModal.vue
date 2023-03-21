<template>
    <div class="fixed inset-0 z-50 flex flex-col gap-8 overflow-y-scroll pt-10">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10"
            @click="emit('closeGalleryPickingModal')">
        </div>

        <!-- Spinners showing status (updating, loading) -->
        <SkewLoader v-if="isUpdating" color="#465A82" size="10px"
            class="m-full h-8 translate-x-[126px] PRO:translate-x-0 absolute top-2 left-1/2" />

        <RingLoader v-if="isLoading" color="#465A82" size="60px" class="m-auto translate-x-[126px] PRO:translate-x-0" />


        <!-- Publication -->
        <div class="relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4">
            <div class="w-96">gallery picking modal</div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import RingLoader from "vue-spinner/src/RingLoader.vue"
import SkewLoader from "vue-spinner/src/SkewLoader.vue";

const isUpdating = ref(false);
const isLoading = ref(false);

const emit = defineEmits(["closeGalleryPickingModal"]);

</script>