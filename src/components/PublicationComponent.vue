<template>
  <div class="shutter-border-color shutter-background-color flex flex-col gap-2 items-center rounded-lg p-4 border-2">

    <!-- Header information (poster, post date) -->
    <div class="flex flex-row items-center justify-between w-full">
      <User class="h-14 mr-auto" :user="props.publication.poster_user"></User>
      <p class="text-xl p-2">{{ props.publication.created_date }}</p>
    </div>

    <!-- Picture -->
    <ImgLoader class="w-full object-cover aspect-square rounded-lg" :src="props.publication.picture" alt="" />

    <!-- Post interaction bar -->
    <div class="flex flex-row justify-between w-full p-1">

      <!-- Rating interface (upvote, downvote) -->
      <RatingInterface @vote-up="publicationStore.voteUpPub(props.publication.publication_id)"
        @vote-down="publicationStore.voteDownPub(props.publication.publication_id)" :total_rate="props.publication.rating"
        :user_rate="props.publication.user_rating"></RatingInterface>

      <!-- Post manipulation subBar -->
      <div class="flex flex-row gap-4">

        <!-- Modify button -->
        <button v-if="isCurrentUser" @click="">
          <ModifyIcon></ModifyIcon>
        </button>

        <!-- Delete button -->
        <DeleteComponent v-if="isCurrentUser" @delete="emit('deletePub')"></DeleteComponent>

        <!-- Add to gallery button -->
        <button @click="emit('addToGallery', props.publication.publication_id)">
          <GalleryIcon></GalleryIcon>
        </button>
      </div>
    </div>

    <!-- Description (disguised as comment) -->
    <Comment class="w-full p-2" :comment="descAsComment"></Comment>

    <!-- Tags display -->
    <div class="w-full flex flex-wrap gap-2 justify-start p-2">
      <button v-for="tag of props.publication.tags" :key="tag"
        class="tag text-xl underline overflow-hidden whitespace-nowrap overflow-ellipsis" @click="emit('searchTag', tag)">
        #{{ tag }}
      </button>
    </div>

    <!-- Comments display -->
    <Comment v-for="comment of props.publication.comments.slice(0, nbCommentsShown)"
      @delete-comment="publicationStore.delComment(props.publication.publication_id, $event)"
      @vote-up="publicationStore.voteUpComment($event, props.publication.publication_id)"
      @vote-down="publicationStore.voteDownComment($event, props.publication.publication_id)" :comment="comment"
      :key="comment.comment_id" class="shutter-border-mute w-full border-t-2 p-2"></Comment>

    <!-- Show more comments button -->
    <button v-if="props.publication.nb_comments > nbCommentsShown"
      class="shutter-border-mute w-full font-bold text-xl border-t-2 p-2 pt-4" @click="showMoreComments">
      Show {{ props.publication.nb_comments - nbCommentsShown }} comment{{
        props.publication.nb_comments === 1 ? "" : "s"
      }}
    </button>

    <!-- Hide comments -->
    <button v-if="props.publication.nb_comments !== 0 && nbCommentsShown > 0"
      class="shutter-border-mute   w-full font-bold text-xl border-t-2 p-2 pt-4" @click="hideComments">
      hide
    </button>

    <!-- Write comment section -->
    <div class="w-full shutter-border-mute border-t-2 p-2 pt-8">
      <div class="w-full flex flex-row inputableContainer rounded-lg border-2">
        <textarea class="inputable w-full max-h-36 text-xl p-2 border-0 rounded-lg" placeholder="Leave a comment..."
          maxlength="200" v-model="message"
          oninput='this.style.height = "";this.style.height = this.scrollHeight + 4 + "px"' @keydown="preventNextLine"
          onkeyup='this.style.height = "";this.style.height = this.scrollHeight + 4 + "px"' @keyup="submitComment" />
        <button class="h-full w-fit p-2 rounded-lg my-auto" @click="submitCommentClick">
          <SubmitIcon></SubmitIcon>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import User from "@/components/UserComponent.vue";
import Comment from "@/components/subComponents/CommentComponent.vue";
import RatingInterface from "@/components/subComponents/RatingInterface.vue";
import GalleryIcon from "@/components/icons/GalleryIcon.vue";
import ModifyIcon from "@/components/icons/modifyIcon.vue";
import DeleteComponent from "./subComponents/DeleteComponent.vue";
import ImgLoader from "./ImgLoader.vue";
import SubmitIcon from "@/components/icons/SubmitIcon.vue"
import { ref } from "vue";
import { usePublicationStore } from "@/stores/publication";
import type { Publication, Comment as Com } from "@/api/type";
import type { PropType } from "vue";

const props = defineProps({
  publication: {
    type: Object as PropType<Publication>,
    required: true,
  },
  isCurrentUser: Boolean
});

const publicationStore = usePublicationStore();
const descAsComment = ref({
  commenter_user: props.publication.poster_user,
  message: props.publication.description,
} as Com);
const message = ref("");
const nbCommentsShown = ref(0);

const emit = defineEmits({
  deletePub: () => {
    return true;
  },
  addToGallery: (publicationId: string) => {
    return !!publicationId;
  },
  searchTag: (tag: string) => {
    return !!tag;
  },
});
const showMoreComments = () => {
  nbCommentsShown.value += publicationStore.serverPageQte;
  if (props.publication.nb_comments > nbCommentsShown.value && props.publication.comments.length == nbCommentsShown.value) {
    publicationStore.getMoreComments(props.publication.publication_id, Math.floor(nbCommentsShown.value / publicationStore.serverPageQte) + 1);
  }
};
const hideComments = () => {
  nbCommentsShown.value = 0;
};
const submitComment = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    publicationStore.addComment(props.publication.publication_id, message.value);
    message.value = "";
  }
};
const submitCommentClick = () => {
  publicationStore.addComment(props.publication.publication_id, message.value);
  message.value = "1";
  message.value = "";
}
const preventNextLine = (event: KeyboardEvent) => {
  if (event.key == "Enter") {
    event.preventDefault();
  }
};
</script>

<style scoped>
.tag {
  color: var(--special-text-color);
}


.inputableContainer {
  border-color: var(--color-border);
  background-color: var(--modal-color);
}

.inputable {
  background-color: transparent;
  box-shadow: none;
  resize: none;
  overflow: hidden;
}
</style>
