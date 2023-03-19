<template>
  <div class="shutter-border-color shutter-background-color flex flex-col gap-2 items-center rounded-lg p-4 border-2">
    <div class="flex flex-row items-center justify-between w-full">
      <User class="h-14 mr-auto" :user="props.publication.poster_user"></User>
      <p class="text-xl p-2">{{ props.publication.created_date }}</p>
    </div>
    <ImgLoader class="w-full object-cover aspect-square rounded-lg" :src="props.publication.picture" alt="" />
    <div class="flex flex-row justify-between w-full p-1">
      <RatingInterface @vote-up="publicationStore.voteUpPub(props.publication.publication_id)"
        @vote-down="publicationStore.voteDownPub(props.publication.publication_id)" :total_rate="props.publication.rating"
        :user_rate="props.publication.user_rating"></RatingInterface>
      <div class="flex flex-row gap-4">
        <button v-if="isCurrentUser" @click="">
          <ModifyIcon></ModifyIcon>
        </button>
        <DeleteComponent v-if="isCurrentUser" @delete="emit('deletePub')"></DeleteComponent>
        <button @click="emit('addToGallery', props.publication.publication_id)">
          <GalleryIcon></GalleryIcon>
        </button>
      </div>
    </div>
    <Comment class="w-full p-2" :comment="descAsComment"></Comment>
    <div class="w-full flex flex-wrap gap-2 justify-start p-2">
      <button v-for="tag of props.publication.tags" :key="tag"
        class="tag text-xl underline overflow-hidden whitespace-nowrap overflow-ellipsis" @click="emit('searchTag', tag)">
        #{{ tag }}
      </button>
    </div>
    <Comment v-for="comment of props.publication.comments.slice(0, nbCommentsShown)"
      @delete-comment="publicationStore.delComment(props.publication.publication_id, $event)"
      @vote-up="publicationStore.voteUpComment($event, props.publication.publication_id)"
      @vote-down="publicationStore.voteDownComment($event, props.publication.publication_id)" :comment="comment"
      :key="comment.comment_id" class="shutter-border-mute w-full border-t-2 p-2"></Comment>
    <button v-if="props.publication.comments.length > nbCommentsShown"
      class="shutter-border-mute w-full font-bold text-xl border-t-2 p-2 pt-4" @click="showMoreComments">
      Show {{ props.publication.comments.length - nbCommentsShown }} comment{{
        props.publication.comments.length === 1 ? "" : "s"
      }}
    </button>
    <button v-if="props.publication.comments.length !== 0 && nbCommentsShown > 0"
      class="shutter-border-mute   w-full font-bold text-xl border-t-2 p-2 pt-4" @click="hideComments">
      hide
    </button>
    <div class="w-full shutter-border-mute border-t-2 p-2 pt-8">
      <textarea class="inputable w-full max-h-36 text-xl p-2 border-2 rounded-lg" placeholder="Leave a comment..."
        maxlength="200" v-model="message"
        oninput='this.style.height = "";this.style.height = this.scrollHeight + 4 + "px"' @keydown="preventNextLine"
        @keyup="submitComment" />
    </div>
  </div>
</template>

<script setup lang="ts">
import User from "@/components/UserComponent.vue";
import Comment from "@/components/CommentComponent.vue";
import RatingInterface from "@/components/RatingInterface.vue";
import GalleryIcon from "@/components/icons/GalleryIcon.vue";
import ModifyIcon from "@/components/icons/modifyIcon.vue";
import DeleteComponent from "./DeleteComponent.vue";
import type { Publication, Comment as Com } from "@/api/type";
import { ref } from "vue";
import type { PropType } from "vue";
import ImgLoader from "./ImgLoader.vue";
import { usePublicationStore } from "@/stores/publication";

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
  nbCommentsShown.value += 10;
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

.inputable {
  border-color: var(--color-border);
  background-color: var(--modal-color);
  box-shadow: none;
  resize: none;
  overflow: hidden;
}
</style>
