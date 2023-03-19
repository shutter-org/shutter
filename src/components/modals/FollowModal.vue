<template>
    <div class="fixed inset-0 z-40 flex justify-center items-center">
        <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full" @click="emit('close')"></div>
        <div
            class="modal-color relative mx-auto p-5 w-[640px] PRO:max-w-[640] shadow-lg rounded-lg PRO:mx-4 translate-x-[126px] PRO:translate-x-0">
            <div class="rounded-lg items-center flex flex-col relative max-w-full h-2/3 overflow-y-scroll">
                <p class="text-2xl font-bold p-2">{{ title }}</p>
                <div class="w-full" v-for="user of props.users.values">
                    <p class="h-2 mt-2 border-t-2 w-full shutter-border-color"></p>
                    <UserComponent class="h-14 p-2 w-full" :user="user" :key="user.username" :smaller="true">
                    </UserComponent>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SimplifiedUser } from '@/api/type';
import type { PropType } from 'vue';
import UserComponent from '../UserComponent.vue';

const props = defineProps({
    users: {
        type: Object as PropType<{ values: SimplifiedUser[] }>,
        required: true
    },
    title: String,
});

const emit = defineEmits(["close"]);
</script>