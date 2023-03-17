<template>
  <div class="shutter-border-color shutter-background-color flex flex-col gap-2 items-center rounded-lg p-4 border-2">
    <div class="flex flex-row items-center justify-between w-full">
      <User class="h-14 mr-auto" :user="props.publication.poster_user"></User>
      <p class="text-xl p-2">{{ props.publication.created_date }}</p>
    </div>
    <img class="w-full object-cover aspect-square rounded-lg" :src="props.publication.picture" alt="" />
    <div class="flex flex-row justify-between w-full p-1">
      <RatingInterface @vote-up="emit('voteUpPub', props.publication.publication_id)"
        @vote-down="emit('voteDownPub', props.publication.publication_id)" :total_rate="props.publication.rating"
        :user_rate="props.publication.user_rating"></RatingInterface>
      <button @click="emit('addToGallery', props.publication.publication_id)">
        <GalleryIcon></GalleryIcon>
      </button>
    </div>
    <Comment class="w-full p-2" :comment="descAsComment"></Comment>
    <div class="w-full flex flex-wrap gap-2 justify-start p-2">
      <button v-for="tag of props.publication.tags" :key="tag"
        class="tag text-xl underline overflow-hidden whitespace-nowrap overflow-ellipsis" @click="emit('searchTag', tag)">
        #{{ tag }}
      </button>
    </div>
    <Comment v-for="comment of props.publication.comments.slice(0, nbCommentsShown)"
      @vote-up="emit('voteUpComment', $event, props.publication.publication_id)"
      @vote-down="emit('voteDownComment', $event, props.publication.publication_id)" :comment="comment" :key="comment.id"
      class="shutter-border-mute w-full border-t-2 p-2"></Comment>
    <div class="w-full shutter-border-mute border-t-2 p-2 pt-6">
      <textarea class="inputable w-full max-h-36 text-xl p-2 border-2 rounded-lg" placeholder="Leave a comment..."
        maxlength="200" v-model="message"
        oninput='this.style.height = "";this.style.height = this.scrollHeight + 4 + "px"' @keydown="preventNextLine"
        @keyup="submitComment" />
    </div>
    <button v-if="props.publication.comments.length > nbCommentsShown"
      class="shutter-border-mute w-full font-bold text-xl border-t-2 p-2 pt-6" @click="showMoreComments">
      Show {{ props.publication.comments.length - nbCommentsShown }} comment{{
        props.publication.comments.length === 1 ? "" : "s"
      }}
    </button>
    <button v-if="props.publication.comments.length !== 0 && nbCommentsShown > 0"
      class="shutter-border-mute   w-full font-bold text-xl border-t-2 p-2 pt-6" @click="hideComments">
      hide
    </button>
  </div>
</template>

<script setup lang="ts">
import User from "@/components/UserComponent.vue";
import Comment from "@/components/CommentComponent.vue";
import RatingInterface from "@/components/RatingInterface.vue";
import GalleryIcon from "@/components/icons/GalleryIcon.vue";
import type { Publication, Comment as Com } from "@/api/type";
import { ref } from "vue";
import type { PropType } from "vue";

const props = defineProps({
  publication: {
    type: Object as PropType<Publication>,
    required: true,
  },
});

const descAsComment = ref({
  commenter_user: props.publication.poster_user,
  message: props.publication.description,
} as Com);

const message = ref("");

const emit = defineEmits({
  voteUpPub: (publicationId: string) => {
    return !!publicationId;
  },
  voteDownPub: (publicationId: string) => {
    return !!publicationId;
  },
  addToGallery: (publicationId: string) => {
    return !!publicationId;
  },
  searchTag: (tag: string) => {
    return !!tag;
  },
  voteUpComment: (commentId: string, publicationId: string) => {
    return !!commentId && !!publicationId;
  },
  voteDownComment: (commentId: string, publicationId: string) => {
    return !!commentId && !!publicationId;
  },
  addComment: (publicationId: string, message: string) => {
    return !!publicationId && !!message;
  },
});

const nbCommentsShown = ref(0);

const showMoreComments = () => {
  nbCommentsShown.value += 10;
};
const hideComments = () => {
  nbCommentsShown.value = 0;
};

const submitComment = (event: KeyboardEvent) => {
  if (event.key === "Enter" && !event.shiftKey) {
    emit("addComment", props.publication.publication_id, message.value);
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
