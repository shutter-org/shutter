<template>
  <div
    class="min-h-screen PRO:min-h-[calc(100vh-160px)] w-full PRO:p-2 PRO:py-2 p-10 max-w-7xl ml-auto mr-auto flex flex-col gap-8 shutter-background-mute">

    <!-- Spinner showing status (updating, loading) -->
    <SkewLoader v-if="isUpdating" color="#465A82" size="10px" class="m-full h-8 absolute top-2 left-1/2" />
    <SyncLoader v-if="isLoading" color="#465A82" size="24px" class="m-auto" />

    <!-- Current user's profile -->
    <Profile v-else :user="user" :is-current-user="true" @open-publication-modal="openPublicationModal"
      @open-profile-modification-modal="openProfileModificationModal" @open-delete-modal="openDeleteModal"
      @open-gallery-creation-modal="openGalleryCreationModal"
      @open-gallery-modification-modal="openGalleryModificationModal"></Profile>

    <!-- Post consultation modal -->
    <PublicationModal class="PRO:my-[80px] p-12" v-if="isPublicationModalShown" :publicationId="shownPublicationId"
      :is-current-user="true" @close="closePublicationModal" @delete="deletePublication" />

    <!-- Profile modification modal -->
    <ProfileModificationModal v-if="isProfileModificationShown" :user="user" @close="closeProfileModificationModal"
      @save="save" />

    <!-- Delete user account modal -->
    <DeleteModal v-if="isDeleteModalShown" @close="closeDeleteModal" @delete-user="delUser" />

    <!-- Gallery creation modal -->
    <GalleryCreationModal v-if="isGalleryCreationModalShown" @close="closeGalleryCreationModal" />

    <!-- Gallery modify modal -->
    <GalleryModificationModal v-if="isGalleryModificationModalShown" @close="closeGalleryModificationModal"
      :gallery="galleryToModify" />
  </div>
</template>

<script setup lang="ts">
import Profile from "@/components/ProfileComponent.vue";
import PublicationModal from "@/components/publicationsComponents/PublicationModal.vue";
import ProfileModificationModal from "@/components/modals/ProfileModificationModal.vue";
import GalleryCreationModal from "@/components/galleryComponents/GalleryCreationModal.vue";
import GalleryModificationModal from "@/components/galleryComponents/GalleryModificationModal.vue";
import DeleteModal from "@/components/modals/DeleteModal.vue";
import SyncLoader from "vue-spinner/src/SyncLoader.vue"
import SkewLoader from "vue-spinner/src/SkewLoader.vue";
import { ref, watch } from "vue";
import { updateUser } from "@/api/user";
import { useUserStore } from '@/stores/user'
import type { Gallery, SimplifiedPublication, User } from "@/api/type";

const userStore = useUserStore();
const user = ref();
const isPublicationModalShown = ref(false);
const shownPublicationId = ref("");
const isProfileModificationShown = ref(false);
const isDeleteModalShown = ref(false);
const isGalleryCreationModalShown = ref(false);
const isGalleryModificationModalShown = ref(false);
const isLoading = ref(true);
const isUpdating = ref(false);
const galleryToModify = ref();

loadUser();

watch(() => userStore.getShownUser(userStore.username) as User, (newUser: User) => {
  user.value = newUser;
});

async function loadUser() {
  const token = userStore.getShownUser(userStore.username);
  if (token !== undefined) {
    user.value = token;
    isLoading.value = false;
    isUpdating.value = true;
  }
  user.value = await userStore.loadShownUser(userStore.username);
  isLoading.value = false;
  isUpdating.value = false;

};
async function save(picture: Blob, picture_url: string, username: string, name: string, bio: string) {
  const body = {} as User;

  async function continueSave() {
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
      if (res.status !== 200) {
        console.log("erreur dans l'update");
      } else {
        userStore.setProfilePicture(picture_url);
        user.value.profile_picture = picture_url;
        user.value.username = username;
        user.value.name = name;
        user.value.biography = bio;

        const data = await res.json();
        if (data.access_token !== undefined) {
          console.log("key changed")
          userStore.setAuthKey(data.access_token);
        }
        if (data.user !== undefined && data.user !== null) {
          if (data.user.username !== undefined) {
            userStore.setUsername(data.user.username);
          }
          if (data.user.profile_picture !== undefined) {
            userStore.setProfilePicture(data.user.profile_picture);
          }
        }
        user.value = await userStore.loadShownUser(userStore.username);
        console.log('updated')
      }
    }
  }

  if (user.value.profile_picture !== picture_url) {
    const reader = new FileReader();
    reader.onload = () => {
      body.profile_picture = reader.result as string;
      continueSave();
    }
    reader.readAsDataURL(picture);
    isProfileModificationShown.value = false;
  }
  else {
    continueSave();
    isProfileModificationShown.value = false;
  }
}
const deletePublication = (publicationId: string) => {
  user.value.publications = user.value.publications.filter((publication: SimplifiedPublication) => {
    return publication.publication_id !== publicationId;
  });
}
const delUser = () => {
  userStore.deleteCurrentUser();
  const logoutButton = document.getElementById("logoutButton");
  logoutButton?.click();
}
const openPublicationModal = (publicationId: string) => {
  console.log(publicationId);
  shownPublicationId.value = publicationId;
  isPublicationModalShown.value = true;
};
const openGalleryCreationModal = () => {
  isGalleryCreationModalShown.value = true;
};
const closePublicationModal = () => {
  isPublicationModalShown.value = false;
};
const closeGalleryCreationModal = () => {
  isGalleryCreationModalShown.value = false;
};
const openGalleryModificationModal = (gallery: Gallery) => {
  galleryToModify.value = gallery;
  isGalleryModificationModalShown.value = true;
};
const closeGalleryModificationModal = () => {
  isGalleryModificationModalShown.value = false;
};
const openProfileModificationModal = () => {
  isProfileModificationShown.value = true;
};
const closeProfileModificationModal = () => {
  isProfileModificationShown.value = false;
};
const openDeleteModal = () => {
  isDeleteModalShown.value = true;
};
const closeDeleteModal = () => {
  isDeleteModalShown.value = false;
};
</script>

