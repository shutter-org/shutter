<template>
  <div class="flex flex-col">

    <!-- User information -->
    <div class="flex flex-row justify-between items-center">
      <User class="h-12" :user="props.comment.commenter_user" :smaller="true"></User>
      <p v-if="props.comment.created_date">{{ props.comment.created_date }}</p>
    </div>

    <!-- Comment message -->
    <p class="w-full text-xl p-1 break-words pl-2">
      {{ props.comment.message }}
    </p>

    <!-- Comment rating and delete -->
    <div class="flex flex-row justify-between">
      <RatingInterface v-if="props.comment.rating !== undefined" @vote-up="emit('voteUp', props.comment.comment_id)"
        @vote-down="emit('voteDown', props.comment.comment_id)" :total_rate="props.comment.rating"
        :user_rate="props.comment.user_rating">
      </RatingInterface>
      <DeleteComponent v-if="props.comment.rating !== undefined && userStore.username == comment.commenter_user.username"
        @delete="emit('deleteComment', comment.comment_id)">
      </DeleteComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import User from "@/components/userComponents/UserComponent.vue";
import RatingInterface from "@/components/subComponents/RatingInterface.vue";
import DeleteComponent from "./DeleteComponent.vue";
import { useUserStore } from "@/stores/user";
import type { PropType } from "vue";
import type { Comment } from "@/api/type";

const props = defineProps({
  comment: {
    type: Object as PropType<Comment>,
    required: true,
  }
});

const userStore = useUserStore();

const emit = defineEmits({
  deleteComment: (commentId: string) => {
    return !!commentId;
  },
  voteUp: (commentId: string) => {
    return !!commentId;
  },
  voteDown: (commentId: string) => {
    return !!commentId;
  },
});
</script>
