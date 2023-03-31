
<template>
    <router-link :to="'/user/' + props.user.username" @click="closeSearchModal" class="w-full rounded-md">
        <div class="py-3 px-1 h-14 flex flex-row items-center">

            <!-- User profile picture -->
            <ImgLoader
                class="w-10 h-10 object-cover aspect-square rounded-full border-2 colored-border mr-8 overflow-hidden"
                :src="props.user.profile_picture" alt="" />

            <!-- User username and name -->
            <div class="flex flex-col">
                <span class="font-bold">{{ props.user.username }}</span>
                <span class="text-sm">{{ props.user.name }}</span>
            </div>
        </div>
    </router-link>
</template>
<script setup lang="ts">
import ImgLoader from '../ImgLoader.vue';
import type { SimplifiedUserWithName } from '@/api/type';


const emit = defineEmits(["closeSearchModal"]);
function closeSearchModal() {
    emit("closeSearchModal");
}
const props = defineProps<{
    user: SimplifiedUserWithName;
}>();
</script>