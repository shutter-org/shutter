<template>
  <div class="fixed inset-0 z-50 flex justify-center overflow-y-scroll">
    <div class="fixed inset-0 bg-gray-900 bg-opacity-50 overflow-y-auto h-full w-full py-10" @click="emit('close')"></div>
    <RingLoader v-if="isLoading" color="#465A82" size="60px" class="m-auto translate-x-[126px] PRO:translate-x-0 " />
    <div v-else class="relative shadow-lg w-full mx-auto max-w-2xl translate-x-[126px] PRO:translate-x-0 PRO:mx-4">
      <publication-component class="" @delete-pub="deletePub" @vote-up-pub="voteUpPub" @vote-down-pub="voteDownPub"
        @vote-up-comment="voteUpComment" @vote-down-comment="voteDownComment" @search-tag="searchTag"
        @add-to-gallery="addToGallery" @add-comment="(publicationId: string, message: string) => addComment(message)"
        @delete-comment="(publicationId: string, commentId: string) => delComment(commentId)"
        :publication="shownPublication" :is-current-user="isCurrentUser"></publication-component>
      <div class="h-10"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from "@/api/type";
import PublicationComponent from "@/components/PublicationComponent.vue";
import RingLoader from "vue-spinner/src/RingLoader.vue"
import { ref } from "vue";
import { getPublication, deletePublication, ratePublication, updateRatingPublication, deleteRatingPublication } from "@/api/publication";
import { deleteRatingComment, postComment, deleteComment, rateComment, updateRatingComment } from "@/api/comment"
import { useUserStore } from '@/stores/user'

const props = defineProps({
  publicationId: {
    type: String,
    required: true,
  },
  isCurrentUser: Boolean
});

const emit = defineEmits({
  close: () => {
    return true;
  },
  delete: (publicationId: string) => {
    return !!publicationId;
  }
});

const userStore = useUserStore();
const shownPublication = ref();
const isLoading = ref(true);

loadPublication();

async function loadPublication() {
  const res = await getPublication(props.publicationId, userStore.authKey);
  if (res.status !== 200) {
    console.log("erreur dans le fetch de la publication");
  }
  else {
    shownPublication.value = await res.json();
  }
  isLoading.value = false;
};
const deletePub = () => {
  deletePublication(shownPublication.value.publication_id, userStore.authKey);
  emit("delete", shownPublication.value.publication_id);
  emit("close");
}
const voteUpPub = () => {
  shownPublication.value.rating -= shownPublication.value.user_rating;
  if (shownPublication.value.user_rating === 1) {
    shownPublication.value.user_rating = 0;
    deleteRatingPublication(shownPublication.value.publication_id, userStore.authKey);
  } else if (shownPublication.value.user_rating === 0) {
    shownPublication.value.user_rating = 1;
    ratePublication(shownPublication.value.publication_id, true, userStore.authKey);
  } else {
    shownPublication.value.user_rating = 1;
    updateRatingPublication(shownPublication.value.publication_id, true, userStore.authKey);
  }
  shownPublication.value.rating += shownPublication.value.user_rating;
};
const voteDownPub = () => {
  shownPublication.value.rating -= shownPublication.value.user_rating;
  if (shownPublication.value.user_rating === -1) {
    shownPublication.value.user_rating = 0;
    deleteRatingPublication(shownPublication.value.publication_id, userStore.authKey);
  } else if (shownPublication.value.user_rating === 0) {
    shownPublication.value.user_rating = -1;
    ratePublication(shownPublication.value.publication_id, false, userStore.authKey);
  } else {
    shownPublication.value.user_rating = -1;
    updateRatingPublication(shownPublication.value.publication_id, false, userStore.authKey);
  }
  shownPublication.value.rating += shownPublication.value.user_rating;
};
const voteUpComment = (commentId: string) => {
  for (let comment of shownPublication.value.comments) {
    if (comment.comment_id === commentId) {
      comment.rating -= comment.user_rating;
      if (comment.user_rating === 1) {
        comment.user_rating = 0;
        deleteRatingComment(commentId, userStore.authKey);
      } else if (comment.user_rating === 0) {
        comment.user_rating = 1;
        rateComment(commentId, true, userStore.authKey);
      } else {
        comment.user_rating = 1;
        updateRatingComment(commentId, true, userStore.authKey);
      }
      comment.rating += comment.user_rating;
    }
  }
};
const voteDownComment = (commentId: string) => {
  for (let comment of shownPublication.value.comments) {
    if (comment.comment_id === commentId) {
      comment.rating -= comment.user_rating;
      if (comment.user_rating === -1) {
        comment.user_rating = 0;
        deleteRatingComment(commentId, userStore.authKey);
      } else if (comment.user_rating === 0) {
        comment.user_rating = -1;
        rateComment(commentId, false, userStore.authKey);
      } else {
        comment.user_rating = -1;
        updateRatingComment(commentId, false, userStore.authKey);
      }
      comment.rating += comment.user_rating;
    }
  }
};
async function addComment(message: string) {
  const res = await postComment(shownPublication.value.publication_id, message, userStore.authKey);
  if (res.status !== 201) {
    console.log("erreur dans la creation du commentaire");
  }
  else {
    const data = await res.json();
    const newCom = {
      comment_id: data.comment_id,
      commenter_user: {
        "username": userStore.username,
        "profile_picture": userStore.profile_picture
      },
      message: message,
      created_date: "now",
      rating: 0,
      user_rating: 0,
    } as Comment;
    shownPublication.value.comments.push(newCom);
  }
};
const delComment = (commentId: string) => {
  deleteComment(commentId, userStore.authKey);
  shownPublication.value.comments = shownPublication.value.comments.filter((comment: Comment) => {
    return comment.comment_id !== commentId;
  });
}
const searchTag = (tag: string) => {
  console.log("searching tag : " + tag);
};
const addToGallery = () => {
  console.log("add publication " + shownPublication.value.publication_id + " to gallery");
};
</script>

<style scoped></style>
