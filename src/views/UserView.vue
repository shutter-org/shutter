<template>
    <div
        class="min-h-screen PRO:min-h-[calc(100vh-160px)] w-full p-10 max-w-7xl ml-auto mr-auto flex flex-col gap-8 shutter-background-mute">

        <!-- Spinner showing status (updating, loading) -->
        <SkewLoader v-if="isUpdating" color="#465A82" size="10px" class="m-full h-8 absolute top-2 left-1/2" />
        <SyncLoader v-if="isLoading" color="#465A82" size="24px" class="m-auto" />

        <!-- User's profile -->
        <Profile v-else-if="doesUserExist" :user="user" :is-current-user="false"
            @open-publication-modal="openPublicationModal"></Profile>

        <!-- Empty page (if user does not exists) -->
        <div v-else
            class="flex flex-col m-auto items-center p-10 rounded-lg border-2 shutter-border-color shutter-background-color">
            <SadIcon class="w-40 h-40"></SadIcon>
            <p class="text-3xl">User does not exist...</p>
        </div>

        <!-- Post consultation modal -->
        <PublicationModal class="PRO:my-[80px] p-12" v-if="isPublicationModalShown" :publicationId="shownPublicationId"
            @close="closePublicationModal" />
    </div>
</template>
  
<script setup lang="ts">
import Profile from "@/components/ProfileComponent.vue";
import PublicationModal from "@/components/publicationsComponents/PublicationModal.vue";
import SyncLoader from "vue-spinner/src/SyncLoader.vue";
import SkewLoader from "vue-spinner/src/SkewLoader.vue";
import SadIcon from "@/components/icons/SadIcon.vue";
import { onMounted, ref } from "vue";
import { useUserStore } from '@/stores/user'
import { useRoute, useRouter } from "vue-router";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const user = ref();
const isPublicationModalShown = ref(false);
const shownPublicationId = ref("");
const isLoading = ref(true);
const isUpdating = ref(false);
const doesUserExist = ref(false);

loadUser(route.params.username as string);

if ((route.params.username as string).toLowerCase() === userStore.username.toLocaleLowerCase()) {
    console.log("test");
    router.push("/profile");
}

async function loadUser(username: string) {
    const token = userStore.getShownUser(username);
    if (token !== undefined) {
        user.value = token;
        isLoading.value = false;
        isUpdating.value = true;
        doesUserExist.value = true;
    }
    user.value = await userStore.loadShownUser(username);
    doesUserExist.value = user.value !== undefined;
    isLoading.value = false;
    isUpdating.value = false;
};
const openPublicationModal = (publicationId: string) => {
    console.log(publicationId);
    shownPublicationId.value = publicationId;
    isPublicationModalShown.value = true;
};
const closePublicationModal = () => {
    isPublicationModalShown.value = false;
};
</script>