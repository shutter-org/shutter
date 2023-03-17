<template>
  <div
    class="min-h-screen PRO:min-h-[calc(100vh-160px)] w-full p-10 max-w-7xl ml-auto mr-auto flex flex-col gap-8 shutter-background-mute">
    <SyncLoader v-if="isLoading" color="#465A82" size="30px" class="m-auto" />
    <Profile v-else :user="user" :is-current-user="true" @open-publication-modal="openPublicationModal"
      @open-profile-modification-modal="openProfileModificationModal"></Profile>
    <PublicationModal class="PRO:my-[80px] p-12" v-if="isPublicationModalShown" :publicationId="shownPublicationId"
      @close="closePublicationModal" />
    <ProfileModificationModal v-if="isProfileModificationShown" :user="user" @close="closeProfileModificationModal"
      @save="save" />
  </div>
</template>

<script setup lang="ts">
import type {
  SimplifiedPublication,
  User,
} from "@/api/type";
import { ref } from "vue";
import Profile from "@/components/ProfileComponent.vue";
import PublicationModal from "@/components/modals/PublicationModal.vue";
import ProfileModificationModal from "@/components/modals/ProfileModificationModal.vue";
import SyncLoader from "vue-spinner/src/SyncLoader.vue"
import { getUser, updateUser } from "@/api/user";
import { useUserStore } from '@/stores/user'

const userStore = useUserStore();
const user = ref();
const isPublicationModalShown = ref(false);
const shownPublicationId = ref("");
const isProfileModificationShown = ref(false);
const isLoading = ref(true);

loadUser();

async function loadUser() {
  const res = await getUser(userStore.username, userStore.authKey);
  if (res.status !== 200) {
    console.log("erreur dans le username ou mdp");
  }
  else {
    user.value = await res.json();
    user.value.profile_picture = user.value.profile_picture || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  }
  isLoading.value = false;
};
async function save(picture: Blob, picture_url: string, username: string, name: string, bio: string) {
  const body = {} as User;
  if (user.value.profile_picture !== picture_url) {
    const reader = new FileReader();
    reader.readAsBinaryString(picture);
    body.profile_picture = reader.result as string;
  }
  if (user.value.username !== username) {
    body.username = username;
  }
  if (user.value.name !== name) {
    body.name = name;
  }
  if (user.value.biography !== bio) {
    body.biography = bio;
  }

  if (Object.keys(body).length !== 0) {
    console.log("updating user");
    const res = await updateUser(userStore.username, userStore.authKey, body);
    userStore.username = username;
    if (res.status !== 200) {
      console.log("erreur dans l'update");
    } else {
      user.value.profile_picture = picture_url;
      user.value.username = username;
      user.value.name = name;
      user.value.biography = bio;
    }
  }

  isProfileModificationShown.value = false;
}
const openPublicationModal = (publicationId: string) => {
  console.log(publicationId);
  shownPublicationId.value = publicationId;
  isPublicationModalShown.value = true;
};
const closePublicationModal = () => {
  isPublicationModalShown.value = false;
};
const openProfileModificationModal = () => {
  isProfileModificationShown.value = true;
};
const closeProfileModificationModal = () => {
  isProfileModificationShown.value = false;
};
</script>

