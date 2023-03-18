<template>
  <div
    class="shutter-background-mute min-h-screen PRO:min-h-[calc(100vh-160px)] p-10 max-w-5xl ml-auto mr-auto flex flex-col gap-8">
    <SyncLoader v-if="isLoading" color="#465A82" size="24px" class="m-auto" />
    <publication v-else-if="publications.length > 0" @vote-up-pub="voteUpPub" @vote-down-pub="voteDownPub"
      @vote-up-comment="voteUpComment" @vote-down-comment="voteDownComment" @search-tag="searchTag"
      @add-to-gallery="addToGallery" @add-comment="addComment" @delete-comment="delComment" v-for="pub in publications"
      :publication="pub" :key="pub.publication_id"></publication>
    <div v-else
      class="flex flex-col m-auto items-center p-10 rounded-lg border-2 shutter-border-color shutter-background-color">
      <EmptyIcon class="w-40 h-40"></EmptyIcon>
      <p class="text-3xl">It's empty here...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import Publication from "@/components/PublicationComponent.vue";
import SyncLoader from "vue-spinner/src/SyncLoader.vue"
import EmptyIcon from "@/components/icons/EmptyIcon.vue";
import type { Publication as Pub, SimplifiedUser, Comment } from "@/api/type";
import { getPublication, ratePublication, updateRatingPublication, deleteRatingPublication, getFollowingPublications } from "@/api/publication";
import { deleteRatingComment, postComment, deleteComment, rateComment, updateRatingComment } from "@/api/comment"
import { useUserStore } from '@/stores/user'
import { ref } from "vue";

const userStore = useUserStore();
const publications = ref([] as Pub[]);
const page = ref(1);
const isLoading = ref(true);

loadPublications();
console.log(publications.value);

async function loadPublications() {
  const res = await getFollowingPublications(page.value, userStore.authKey);
  if (res.status !== 200) {
    console.log("erreur dans le fetch des publications");
  }
  else {
    publications.value = await res.json();
  }
  isLoading.value = false;
};
const voteUpPub = (pubId: string) => {
  for (let pub of publications.value) {
    if (pub.publication_id === pubId) {
      pub.rating -= pub.user_rating;
      if (pub.user_rating === 1) {
        pub.user_rating = 0;
        deleteRatingPublication(pub.publication_id, userStore.authKey);
      } else if (pub.user_rating === 0) {
        pub.user_rating = 1;
        ratePublication(pub.publication_id, true, userStore.authKey);
      } else {
        pub.user_rating = 1;
        updateRatingPublication(pub.publication_id, true, userStore.authKey);
      }
      pub.rating += pub.user_rating;
    }
  }
};
const voteDownPub = (pubId: string) => {
  for (let pub of publications.value) {
    if (pub.publication_id === pubId) {
      pub.rating -= pub.user_rating;
      if (pub.user_rating === -1) {
        pub.user_rating = 0;
        deleteRatingPublication(pub.publication_id, userStore.authKey);
      } else if (pub.user_rating === 0) {
        pub.user_rating = -1;
        ratePublication(pub.publication_id, false, userStore.authKey);
      } else {
        pub.user_rating = -1;
        updateRatingPublication(pub.publication_id, false, userStore.authKey);
      }
      pub.rating += pub.user_rating;
    }
  }
};
const voteUpComment = (commentId: string, pubId: string) => {
  for (let pub of publications.value) {
    if (pub.publication_id === pubId) {
      for (let comment of pub.comments) {
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
    }
  }
};
const voteDownComment = (commentId: string, pubId: string) => {
  for (let pub of publications.value) {
    if (pub.publication_id === pubId) {
      for (let comment of pub.comments) {
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
    }
  }
};
async function addComment(pubId: string, message: string) {
  for (let pub of publications.value) {
    if (pub.publication_id === pubId) {
      const res = await postComment(pub.publication_id, message, userStore.authKey);
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
        pub.comments.push(newCom);
      }
    }
  }
};
const delComment = (publicationId: string, commentId: string) => {
  for (let pub of publications.value) {
    if (pub.publication_id === publicationId) {
      deleteComment(commentId, userStore.authKey);
      pub.comments = pub.comments.filter((comment: Comment) => {
        return comment.comment_id !== commentId;
      });
    }
  }
}
const searchTag = (tag: string) => {
  console.log("searching tag : " + tag);
};
const addToGallery = (pubId: string) => {
  console.log("add publication " + pubId + " to gallery");
};
</script>

