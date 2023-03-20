<template>
  <div
    class="shutter-border-color shutter-background-color w-full flex flex-col gap-2 items-center rounded-lg p-4 border-2">
    <div class="w-full h-40 PRO:h-80 flex flex-row PRO:flex-col gap-10 items-center p-2">
      <ImgLoader class="h-full PRO:h-1/2 object-cover aspect-square rounded-full border-2"
        :src="props.user.profile_picture" :round="true" alt="" />
      <div class="h-full w-full flex flex-col gap-4 justify-center overflow-x-auto">
        <p
          class="w-full font-bold text-4xl inline overflow-hidden whitespace-nowrap overflow-ellipsis PRO:text-center p-1">
          {{ props.user.username }}
        </p>
        <p class="w-full font-bold text-2xl inline overflow-hidden PRO:text-center p-1">
          {{ props.user.name }} • {{ props.user.age }}
        </p>
      </div>
    </div>
    <p v-if="props.user.biography" class="w-full text-2xl p-2 pb-4 px-6 border-t-2 border-b-2 bottom-border break-words">
      {{
        props.user.biography
      }}</p>
    <div class="w-full h-20 flex flex-row gap-10 items-center p-2 pb-4 justify-evenly border-b-2 bottom-border">
      <p class="w-full font-bold text-xl PRO:text-lg overflow-hidden overflow-ellipsis text-center">
        {{ props.user.nb_publications }} Posts
      </p>
      <button class="w-full font-bold text-xl PRO:text-lg overflow-hidden overflow-ellipsis text-center"
        @click="isFollowerShown = true">
        {{ props.user.nb_followers }} Followers
      </button>
      <button class="w-full font-bold text-xl PRO:text-lg overflow-hidden overflow-ellipsis text-center"
        @click="isFollowingShown = true">
        {{ props.user.nb_following }} Following
      </button>
    </div>
    <button v-if="!isCurrentUser && !user.followed_by_user"
      class="followButton mt-4 w-3/4 h-18 text-xl p-2 rounded-lg pr-10 pl-10"
      @click="userStore.follow(user.username)">Follow</button>
    <button v-else-if="!isCurrentUser && user.followed_by_user"
      class="unFollowButton mt-4 w-3/4 h-18 text-xl p-2 rounded-lg pr-10 pl-10"
      @click="userStore.unfollow(user.username)">Unfollow</button>
    <div class="w-full h-16 flex flex-row py-2 justify-evenly">
      <button id="pictureTabButton"
        class="w-full h-full p-2 selected-bottom-border border-b-2 flex flex-row justify-center items-center"
        @click="togglePictureTab">
        <ImageIcon class="h-full aspect-square"></ImageIcon>
      </button>
      <button id="galleryTabButton"
        class="w-full h-full p-2 bottom-border border-b-2 flex flex-row justify-center items-center"
        @click="toggleGalleryTab">
        <GalleryIcon class="h-full aspect-square"></GalleryIcon>
      </button>
    </div>
    <div v-if="isPictureTabShown" class="w-full h-full grid grid-cols-3 PRO:grid-cols-2 gap-6 PRO:gap-4 p-4 pt-10">
      <button v-for="post of props.user.publications" @click="emit('openPublicationModal', post.publication_id)"
        :key="post.publication_id">
        <ImgLoader class="w-full object-cover aspect-square rounded-lg" :src="post.picture" alt="" />
      </button>
    </div>

    <SkewLoader v-if="isBusy" color="#465A82" size="10px" class="m-full h-8" />
    <button v-if="user.nb_publications > user.publications.length" @click="showMore"
      class="w-full rounded-lg font-bold text-xl p-2 px-4">Show more</button>
    <div v-if="!isPictureTabShown" class="w-full">
      <GalleryComponent v-for="gallery in user.gallerys" :gallery="gallery"
        @open-publication-modal="openPublicationModalFromGallery" />
    </div>
    <p class="text-xs text-center font-bold w-full p-2 pt-6 border-t-2 bottom-border mt-6">
      member since {{ props.user.created_date }}
    </p>
    <button v-if="isCurrentUser" id="modifyButton" class="h-8 w-8 absolute right-4 top-4"
      @click="emit('openProfileModificationModal')">
      <ModifyIcon class="h-full w-full" />
    </button>
  </div>
  <FollowModal v-if="isFollowingShown" :users="{ values: props.user.following }" title="Following"
    @close="isFollowingShown = false">
  </FollowModal>
  <FollowModal v-if="isFollowerShown" :users="{ values: props.user.followers }" title="Follower"
    @close="isFollowerShown = false">
  </FollowModal>
</template>

<script setup lang="ts">
import ImageIcon from "@/components/icons/ImageIcon.vue";
import GalleryIcon from "@/components/icons/GalleryIcon.vue";
import ModifyIcon from "@/components/icons/modifyIcon.vue";
import ImgLoader from "./ImgLoader.vue";
import FollowModal from "./modals/FollowModal.vue";
import SkewLoader from "vue-spinner/src/SkewLoader.vue";
import GalleryComponent from "./GalleryComponent.vue";
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import type { PropType } from "vue";
import type { User } from "@/api/type";


const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  },
  isCurrentUser: Boolean
});

const userStore = useUserStore();
const nextPage = ref(2);
const isPictureTabShown = ref(true);
const isFollowingShown = ref(false);
const isFollowerShown = ref(false);
const isBusy = ref(false);

const emit = defineEmits({
  openPublicationModal: (publicationId: string) => {
    return !!publicationId;
  },
  openProfileModificationModal: () => {
    return true;
  },
});

const showMore = async () => {
  if (!isBusy.value) {
    isBusy.value = true;
    if (props.user.publications.length < props.user.nb_publications) {
      console.log("loading more posts")
      await userStore.loadMorePublications(props.user.username, nextPage.value);
      nextPage.value += 1;
    }
    isBusy.value = false;
  }
}
const togglePictureTab = () => {
  isPictureTabShown.value = true;

  let pictureTabButton = document.getElementById("pictureTabButton")!;
  pictureTabButton.classList.add("selected-bottom-border");
  pictureTabButton.classList.remove("bottom-border");

  let galleryTabButton = document.getElementById("galleryTabButton")!;
  galleryTabButton.classList.add("bottom-border");
  galleryTabButton.classList.remove("selected-bottom-border");
};
const toggleGalleryTab = () => {
  isPictureTabShown.value = false;

  let galleryTabButton = document.getElementById("galleryTabButton")!;
  galleryTabButton.classList.add("selected-bottom-border");
  galleryTabButton.classList.remove("bottom-border");

  let pictureTabButton = document.getElementById("pictureTabButton")!;
  pictureTabButton.classList.add("bottom-border");
  pictureTabButton.classList.remove("selected-bottom-border");
};
const openPublicationModalFromGallery = (publicationId: string) => {
  emit("openPublicationModal", publicationId);
};
</script>

<style scoped>
.profile {
  border-color: var(--color-border);
  background-color: var(--color-background);
}

.bottom-border {
  border-color: var(--color-background-mute);
}

.selected-bottom-border {
  border-color: var(--color-border);
}

.followButton {
  background-color: var(--color-border);
}

.unFollowButton {
  background-color: var(--hover-color);
}
</style>
