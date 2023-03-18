<template>
    <div>
        <Clip-loader v-if="loading" color="#465A82" size="24px"
            class="flex justify-center items-center w-full h-full object-cover rounded-lg shutter-modal-color"
            :style="props.round ? { 'border-radius': '9999px' } : { 'border-radius': '8px' }"></Clip-loader>
        <img v-show="!loading" class="w-full h-full object-cover" @load="loaded" :src="src" alt=""
            :style="props.round ? { 'border-radius': '9999px' } : { 'border-radius': '8px' }" />
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import ClipLoader from 'vue-spinner/src/ClipLoader.vue'

const props = defineProps({
    src: {
        type: String,
        required: true
    },
    round: Boolean
})

const loading = ref(true);

const loaded = () => {
    loading.value = false;
}
</script>
  