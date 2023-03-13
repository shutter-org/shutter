<template>
  <div class="post flex flex-col gap-2 items-center rounded-lg p-4">
    <User
      class="h-14 mr-auto"
      :profile_picture="profile_picture"
      :username="username"
    ></User>
    <img
      class="w-full object-cover aspect-square rounded-lg"
      :src="image"
      alt=""
    />
    <RatingInterface
      :total_rate="total_rate"
      :user_rate="user_rate"
    ></RatingInterface>
    <Comment
      class="w-full"
      :profile_picture="profile_picture"
      :username="username"
      :comment_content="desc"
    ></Comment>
  </div>
</template>

<script>
import User from "@/components/User.vue";
import Comment from "@/components/Comment.vue";
import RatingInterface from "@/components/RatingInterface.vue";
export default {
  components: {
    RatingInterface,
    User,
    Comment,
  },
  name: "default-publication",
  props: {
    username: String,
    profile_picture: String,
    image: String,
    desc: String,
    tags: String,
    total_rate: Number,
    user_rate: Number,
  },
};
</script>

<style scoped>
.post {
  border-width: 2px;
  border-color: var(--color-border);
  background-color: var(--color-background);
}
</style>
