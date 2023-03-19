
<template>
    <a href="#" class="w-full rounded-md">
        <div class="py-3 px-1 h-14 flex flex-row items-center">
            <img class="w-10 h-10 rounded-full mr-8" :src="user.profile_picture" alt="" />
            <div class="flex flex-col">
                <span class="font-bold">{{ user.username }}</span>
                <span class="text-sm">{{ user.name }}</span>
            </div>
        </div>
    </a>
</template>
<script setup lang="ts">
import type { SimplifiedUserWithName } from '@/api/type';
const props = defineProps<{
    user: SimplifiedUserWithName;
}>();
</script>