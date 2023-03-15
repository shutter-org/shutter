<template>
  <div class="post flex flex-col gap-2 items-center rounded-lg p-4 border-2">
    <div class="flex flex-row items-center justify-between w-full">
      <User class="h-14 mr-auto" :user="publication.user"></User>
      <p class="text-xl p-2">{{ publication.date }}</p>
    </div>
    <img
      class="w-full object-cover aspect-square rounded-lg"
      :src="publication.picture"
      alt=""
    />
    <div class="flex flex-row justify-between w-full p-1">
      <RatingInterface
        @vote-up="this.$emit('voteUpPub', publication.id)"
        @vote-down="this.$emit('voteDownPub', publication.id)"
        :total_rate="publication.total_rate"
        :user_rate="publication.user_rate"
      ></RatingInterface>
      <button @click="this.$emit('addToGallery', publication.id)">
        <GalleryIcon></GalleryIcon>
      </button>
    </div>
    <Comment
      class="w-full p-2"
      :comment="{ user: publication.user, content: publication.desc }"
    ></Comment>
    <div class="w-full flex flex-wrap gap-2 justify-start p-2">
      <button
        v-for="tag of publication.tags"
        :key="tag"
        class="tag text-xl underline overflow-hidden whitespace-nowrap overflow-ellipsis"
        @click="this.$emit('searchTag', tag)"
      >
        #{{ tag }}
      </button>
    </div>
    <Comment
      v-for="comment of publication.comments.filter(() => areCommentsShown)"
      @vote-up="this.$emit('voteUpComment', $event, publication.id)"
      @vote-down="this.$emit('voteDownComment', $event, publication.id)"
      :comment="comment"
      :key="comment.id"
      class="colored-top-border w-full border-t-2 p-2"
    ></Comment>
    <button
      v-if="publication.comments.length !== 0 && !areCommentsShown"
      class="colored-top-border w-full font-bold text-xl border-t-2 p-2 pt-6"
      @click="this.areCommentsShown = true"
    >
      Show {{ publication.comments.length }} comment{{
        publication.comments.length === 1 ? "" : "s"
      }}
    </button>
    <button
      v-else-if="publication.comments.length !== 0"
      class="colored-top-border w-full font-bold text-xl border-t-2 p-2 pt-6"
      @click="this.areCommentsShown = false"
    >
      hide
    </button>
  </div>
</template>

<script lang="ts">
import User from "@/components/User.vue";
import Comment from "@/components/Comment.vue";
import RatingInterface from "@/components/RatingInterface.vue";
import GalleryIcon from "@/components/icons/GalleryIcon.vue";
import type { Publication } from "@/api/type";

export default {
  components: {
    GalleryIcon,
    RatingInterface,
    User,
    Comment,
  },
  name: "default-publication",
  props: {
    publication: {} as Publication,
  },
  data() {
    return {
      areCommentsShown: false,
    };
  },
  methods: {
    addToGallery() {
      console.log("add to gallery");
    },
  },
};
</script>

<style scoped>
.post {
  border-color: var(--color-border);
  background-color: var(--color-background);
}

.colored-top-border {
  border-color: var(--color-background-mute);
}

.tag {
  color: var(--special-text-color);
}
</style>
