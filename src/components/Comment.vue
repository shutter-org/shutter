<template>
  <div class="flex flex-col">
    <User
      class="h-12"
      :profile_picture="profile_picture"
      :username="username"
      :smaller="true"
    ></User>
    <p class="w-full text-xl p-1 break-words pl-2">{{ comment_content }}</p>
  </div>
</template>

<script>
import User from "@/components/User.vue";
export default {
  components: {
    User,
  },
  name: "default-comment",
  props: ["profile_picture", "username", "comment_content"],
};
</script>

<style scoped></style>
