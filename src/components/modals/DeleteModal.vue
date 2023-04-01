<template>
    <div class="fixed inset-0 z-50 flex justify-center items-center">

        <!-- Gray background -->
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10" @click="emit('close')">
        </div>

        <!-- Modal -->
        <div
            class="shutter-modal-color relative mx-auto p-5 w-[640px] PRO:max-w-[640] shadow-lg rounded-lg PRO:mx-4 translate-x-[126px] PRO:translate-x-0">
            <div class="rounded-lg items-center flex flex-col relative max-w-full h-2/3 overflow-y-scroll">
                <SadIcon class="h-40 w-40" />
                <p class="text-xl font-bold p-2">Are you sure you want to delete your account ?</p>
                <p class="text-xl font-bold p-2">This action is irreversible !</p>
                <DeleteComponent @delete="emit('deleteUser')"></DeleteComponent>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import DeleteComponent from '../subComponents/DeleteComponent.vue';
import SadIcon from '../icons/SadIcon.vue';

const emit = defineEmits(["close", "deleteUser"]);
</script>