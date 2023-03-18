<template>
    <button v-if="!isDeleting" @click="isDeleting = true">
        <DeleteIcon></DeleteIcon>
    </button>
    <div v-else class="flex flex-row gap-4">
        <button @click="emit('delete')">
            <ConfirmIcon></ConfirmIcon>
        </button>
        <button @click="isDeleting = false">
            <RejectIcon></RejectIcon>
        </button>
    </div>
</template>

<script setup>
import DeleteIcon from "@/components/icons/DeleteIcon.vue";
import ConfirmIcon from "@/components/icons/ConfirmIcon.vue";
import RejectIcon from "@/components/icons/RejectIcon.vue";
import { ref } from "vue";

const isDeleting = ref(false);

const emit = defineEmits(["delete"])
</script>