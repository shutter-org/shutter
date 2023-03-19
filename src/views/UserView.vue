<template>
    <div
        class="min-h-screen PRO:min-h-[calc(100vh-160px)] w-full p-10 max-w-7xl ml-auto mr-auto flex flex-col gap-8 shutter-background-mute">
        <SyncLoader v-if="isLoading" color="#465A82" size="24px" class="m-auto" />
        <Profile v-else-if="doesUserExist" :user="user" :is-current-user="false"
            @open-publication-modal="openPublicationModal" @follow="follow" @unfollow="unfollow"></Profile>
        <div v-else
            class="flex flex-col m-auto items-center p-10 rounded-lg border-2 shutter-border-color shutter-background-color">
            <SadIcon class="w-40 h-40"></SadIcon>
            <p class="text-3xl">User does not exist...</p>
        </div>
        <PublicationModal class="PRO:my-[80px] p-12" v-if="isPublicationModalShown" :publicationId="shownPublicationId"
            @close="closePublicationModal" />
    </div>
</template>
  
<script setup lang="ts">
import { ref } from "vue";
import Profile from "@/components/ProfileComponent.vue";
import PublicationModal from "@/components/modals/PublicationModal.vue";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import SadIcon from "@/components/icons/SadIcon.vue";
import { getUser } from "@/api/user";
import { useUserStore } from '@/stores/user'
import { useRoute } from "vue-router";

const userStore = useUserStore();
const route = useRoute();
const user = ref();
const isPublicationModalShown = ref(false);
const shownPublicationId = ref("");
const isLoading = ref(true);
const doesUserExist = ref(false);

loadUser(route.params.username as string);

async function loadUser(username: string) {
    const token = userStore.getShownUser(username);
    if (token !== undefined) {
        user.value = token;
        isLoading.value = false;
        doesUserExist.value = true;
    }
    user.value = await userStore.loadShownUser(username);
    doesUserExist.value = user.value !== undefined;
    isLoading.value = false;
};
const openPublicationModal = (publicationId: string) => {
    console.log(publicationId);
    shownPublicationId.value = publicationId;
    isPublicationModalShown.value = true;
};
const closePublicationModal = () => {
    isPublicationModalShown.value = false;
};
const follow = () => {
    user.value.followed_by_user = true;
}
const unfollow = () => {
    user.value.followed_by_user = false;
}
</script>