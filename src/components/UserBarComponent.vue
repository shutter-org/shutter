
<template>
    <router-link :to="loggedUsername !== props.user.username ? '/user/' + props.user.username : '/profile'"
        class="w-full rounded-md">
        <div class="p-2 h-14 flex flex-row items-center">
            <ImgLoader class="w-10 h-10 object-cover aspect-square rounded-full border-2 mr-8 overflow-hidden"
                :src="props.user.profile_picture" alt="" />
            <div class="flex flex-col">
                <span class="font-bold">{{ props.user.username }}</span>
                <span class="text-sm">{{ props.user.name }}</span>
            </div>
        </div>
    </router-link>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import type { SimplifiedUserWithName } from '@/api/type';
import { useUserStore } from '@/stores/user';
import ImgLoader from './ImgLoader.vue';
const props = defineProps<{
    user: SimplifiedUserWithName;
}>();
const userStore = useUserStore();
const loggedUsername = ref(userStore.username);
</script>