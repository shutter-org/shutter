<template>
  <div class="flex flex-col">
    <div class="flex flex-row justify-between items-center">
      <User class="h-12" :user="comment.user" :smaller="true"></User>
      <p v-if="comment.date">{{ comment.date }}</p>
    </div>
    <p class="w-full text-xl p-1 break-words pl-2">{{ comment.content }}</p>
  </div>
</template>

<script lang="ts">
import User from "@/components/User.vue";
import type { Comment } from "@/api/type";
export default {
  components: {
    User,
  },
  name: "default-comment",
  props: {
    comment: {} as Comment,
  },
};
</script>

<style scoped></style>
