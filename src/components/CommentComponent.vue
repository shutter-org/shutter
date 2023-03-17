<template>
  <div class="flex flex-col">
    <div class="flex flex-row justify-between items-center">
      <User class="h-12" :user="props.comment.commenter_user" :smaller="true"></User>
      <p v-if="props.comment.created_date">{{ props.comment.created_date }}</p>
    </div>
    <p class="w-full text-xl p-1 break-words pl-2">
      {{ props.comment.message }}
    </p>
    <RatingInterface @vote-up="emit('voteUp', props.comment.comment_id)"
      @vote-down="emit('voteDown', props.comment.comment_id)" v-if="props.comment.rating !== undefined"
      :total_rate="props.comment.rating" :user_rate="props.comment.user_rating">
    </RatingInterface>
  </div>
</template>

<script setup lang="ts">
import User from "@/components/UserComponent.vue";
import type { Comment } from "@/api/type";
import RatingInterface from "@/components/RatingInterface.vue";
import type { PropType } from "vue";

const props = defineProps({
  comment: {
    type: Object as PropType<Comment>,
    required: true,
  }
});

const emit = defineEmits({
  voteUp: (commentId: string) => {
    return !!commentId;
  },
  voteDown: (commentId: string) => {
    return !!commentId;
  },
});
</script>

<style scoped></style>
